import { getRouteAPI, postAuthRouteAPI, getAuthRouteAPI } from './apisService'
import { getNewToken } from './fireBaseAuthService'
import { examScoreUtils } from './examScoreUtils'

/**
 * Service for handling exam result submission
 */
export const examResultService = {
    /**
     * Submit exam results automatically when student completes exam
     * @param {Object} examData - Complete exam data
     * @param {Object} results - Exam results data
     * @param {string} examId - Exam ID
     * @param {string} studentId - Student ID
     * @param {Object} options - Additional options (termination info, courseId, etc.)
     * @returns {Promise<Object>} - API response
     */
    buildExamResultPayload(examData, results, examId, studentId, options = {}) {
        // isCompleted distinguishes a finished exam from a partial in-progress
        // snapshot. Partial saves must NOT block re-entry; only finished exams
        // do. Termination forces isCompleted=false regardless of caller intent.
        const isTerminated = options.isTerminated || false;
        const isCompleted = isTerminated
            ? false
            : (typeof options.isCompleted === 'boolean' ? options.isCompleted : true);
        const submissionType = isTerminated ? 'terminated' : (isCompleted ? 'completed' : 'in_progress');

        return {
            routeName: 'submitExamResult',
            examId,
            studentId,
            examData: {
                examName: examData.title,
                examDuration: examData.duration,
                totalQuestions: results.totalQuestions,
                score: results.score,
                correctAnswers: results.correctQuestions,
                wrongAnswers: results.wrongQuestions,
                unansweredQuestions: results.unansweredQuestions,
                markedQuestions: results.markedQuestions,
                timeSpent: results.timeSpent,
                totalTime: results.totalTime,
                sections: results.sections,
                sectionDetails: results.sectionDetails,
                reviewQuestions: results.reviewQuestions,
                examDate: new Date().toISOString(),
                status: results.score >= 60 ? 'pass' : 'fail',
                distractionEvents: results.distractionEvents || [],
                distractionStrikes: results.distractionStrikes || 0,
                isCompleted,
                isTerminated,
                terminationReason: options.terminationReason || null,
                submissionType
            }
        };
    },

    async submitExamResultPayload(payload, retryCount = 0) {
        const MAX_RETRIES = 3;

        try {
            const response = await postAuthRouteAPI(payload);
            return response;
        } catch (error) {
            if (error?.response?.status === 401) {
                try {
                    await getNewToken();
                    return await this.submitExamResultPayload(payload, retryCount);
                } catch (refreshError) {
                    throw refreshError;
                }
            }

            const isNetworkError = !error?.response?.status || error?.response?.status >= 500;
            if (isNetworkError && retryCount < MAX_RETRIES) {
                const delay = 1000 * Math.pow(2, retryCount);
                await new Promise(resolve => setTimeout(resolve, delay));
                return await this.submitExamResultPayload(payload, retryCount + 1);
            }

            throw error;
        }
    },

    submitExamResultPayloadKeepalive(payload) {
        if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
        const baseUrl = process.env.API_BASE_URL;
        const accessToken = localStorage.getItem('accessToken');
        if (!baseUrl || !accessToken) return false;

        try {
            fetch(`${baseUrl}/auth/route/post`, {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            }).catch(() => { });
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Get exam results for a specific student and exam
     * @param {string} examId - Exam ID
     * @param {string} studentId - Student ID
     * @returns {Promise<Object>} - API response
     */
    async getStudentExamResult(examId, studentId) {
        try {
            const requestData = {
                routeName: 'getStudentExamResult',
                examId: examId,
                studentId: studentId
            }

            const response = await getRouteAPI(requestData)
            return response
        } catch (error) {
            console.error('Error fetching student exam result:', error)

            if (error?.response?.status === 401) {
                try {
                    await getNewToken()
                    return await this.getStudentExamResult(examId, studentId)
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }

            throw error
        }
    },

    /**
     * Get all exam results for the current student
     * @returns {Promise<Object>} - API response
     */
    async getAllStudentExamResults(retryCount = 0) {
        try {
            const requestData = {
                routeName: 'getStudentAllExamResults'
            }

            const response = await getAuthRouteAPI(requestData)
            return response
        } catch (error) {
            console.error('Error fetching all student exam results:', error)

            // Only retry once on authentication error
            if (error?.response?.status === 401 && retryCount === 0) {
                try {
                    console.log('Token expired, attempting to refresh...')
                    await getNewToken()
                    // Retry once with incremented retry count
                    return await this.getAllStudentExamResults(retryCount + 1)
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }

            // For all other errors or if already retried, throw the error
            throw error
        }
    },

    /**
     * Check if student has already taken this exam
     * @param {string} examId - Exam ID
     * @param {string} studentId - Student ID
     * @returns {Promise<boolean>} - Whether student has taken the exam
     */
    async hasStudentTakenExam(examId, studentId) {
        try {
            const result = await this.getStudentExamResult(examId, studentId)

            let responseData;
            if (result.body || result.data) {
                const raw = result.body || result.data;
                responseData = typeof raw === 'string' ? JSON.parse(raw) : raw;
            } else {
                responseData = result;
            }

            if (!responseData.success) {
                return false
            }

            const records = responseData.data;
            if (!records) return false;

            // Only treat the exam as "taken" when a completed record exists.
            // Partial in-progress snapshots (mid-exam tab close, network drop)
            // must not block re-entry — the student can resume and overwrite
            // via the backend's idempotent upsert.
            const isComplete = (r) => {
                if (!r) return false;
                if (r.isCompleted === true) return true;
                if (r.isTerminated === true) return true; // terminated counts as taken
                if (r.submissionType === 'completed' || r.submissionType === 'terminated') return true;
                // Legacy records without isCompleted: treat as completed for backward compat
                if (r.isCompleted === undefined && r.submissionType === undefined) return true;
                return false;
            };

            if (Array.isArray(records)) {
                return records.some(isComplete);
            }
            return isComplete(records);
        } catch (error) {
            if (error?.response?.status === 404) {
                return false
            }
            throw error
        }
    },

    /**
     * Prepare exam results data for submission
     * @param {Object} examData - Exam data
     * @param {Array} allReviewQuestions - All review questions
     * @param {Array} allExamQuestions - All exam questions
     * @param {Array} elapsedTime - Elapsed time for each section
     * @param {Array} distractionEvents - Distraction events
     * @param {number} distractionStrikes - Number of distraction strikes
     * @returns {Object} - Formatted results data
     */
    prepareExamResults(examData, allReviewQuestions, allExamQuestions, elapsedTime, distractionEvents = [], distractionStrikes = 0) {
        const flatReviewQuestions = allReviewQuestions.flat();
        const flatExamQuestions = allExamQuestions.flat();

        let unAnswered = 0;
        let marked = 0;

        const reviewQuestions = flatReviewQuestions.map((q, index) => {
            const examQ = flatExamQuestions[index] || {};
            const isCorrect = q.selectedAnswer != null && String(q.selectedAnswer) === String(examQ.correctAnswer);
            if (!q.answered) unAnswered++;
            if (q.isMarked) marked++;

            return {
                questionId: typeof q.id === 'string' ? q.id : (q.id != null ? String(q.id) : ''),
                selectedAnswer: typeof q.selectedAnswer === 'string' ? q.selectedAnswer : (q.selectedAnswer != null ? String(q.selectedAnswer) : ''),
                isCorrect,
                isMarked: !!q.isMarked,
                answered: !!q.answered,
                timeSpent: q.timeSpent ? String(q.timeSpent) : "00:00"
            };
        });

        const overall = examScoreUtils.overallScore(examData, allExamQuestions, allReviewQuestions);
        const totalQuestions = overall.total;
        const correctAnswers = overall.correct;
        const score = overall.percentage;

        const results = {
            totalQuestions,
            score,
            correctQuestions: correctAnswers,
            wrongQuestions: Math.max(0, totalQuestions - correctAnswers - unAnswered),
            unansweredQuestions: unAnswered,
            markedQuestions: marked,
            timeSpent: this.calculateTotalTime(elapsedTime),
            totalTime: examData.duration + ":00",
            sections: this.prepareSectionsDataWithQuestions(examData, allReviewQuestions, allExamQuestions, elapsedTime),
            sectionDetails: this.prepareSectionDetails(examData, allReviewQuestions, allExamQuestions, elapsedTime),
            reviewQuestions,
            distractionEvents,
            distractionStrikes,
            examDate: new Date().toISOString()
        };

        return results;
    },

    /**
     * Calculate total time from elapsed time array
     * @param {Array} elapsedTime - Array of elapsed times
     * @returns {string} - Formatted total time
     */
    calculateTotalTime(elapsedTime) {
        if (!elapsedTime || elapsedTime.length === 0) return "00:00"

        let totalMinutes = 0
        let totalSeconds = 0

        elapsedTime.forEach(time => {
            const [minutes, seconds] = time.split(':').map(Number)
            totalMinutes += minutes
            totalSeconds += seconds
        })

        if (totalSeconds > 59) {
            totalMinutes += Math.floor(totalSeconds / 60);
            totalSeconds = totalSeconds % 60;
        }

        return `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`
    },

    /**
     * Prepare sections data with nested questions (NEW STRUCTURE)
     * @param {Object} examData - Exam data
     * @param {Array} allReviewQuestions - All review questions (by section)
     * @param {Array} allExamQuestions - All exam questions (by section)
     * @param {Array} elapsedTime - Elapsed time for each section
     * @returns {Array} - Sections data with nested questions
     */
    prepareSectionsDataWithQuestions(examData, allReviewQuestions, allExamQuestions, elapsedTime) {
        if (!examData?.sections) {
            return [];
        }

        return examData.sections.map((sectionData, sectionIndex) => {
            const sectionReviewQuestions = (allReviewQuestions && allReviewQuestions[sectionIndex]) || [];
            const sectionExamQuestions = (allExamQuestions && allExamQuestions[sectionIndex]) || [];

            const questions = sectionReviewQuestions.map((reviewQ, questionIndex) => {
                const byIndex = sectionExamQuestions[questionIndex];
                const examQ = byIndex || sectionExamQuestions.find(q => String(q?._id) === String(reviewQ?.id)) || {};
                const isCorrect = reviewQ.selectedAnswer != null && String(reviewQ.selectedAnswer) === String(examQ.correctAnswer);

                return {
                    questionId: typeof reviewQ.id === 'string' ? reviewQ.id : (reviewQ.id != null ? String(reviewQ.id) : ''),
                    correctAnswer: examQ.correctAnswer != null ? String(examQ.correctAnswer) : '',
                    selectedAnswer: typeof reviewQ.selectedAnswer === 'string' ? reviewQ.selectedAnswer : (reviewQ.selectedAnswer != null ? String(reviewQ.selectedAnswer) : ''),
                    isCorrect,
                    isMarked: !!reviewQ.isMarked,
                    answered: !!reviewQ.answered,
                    timeSpent: reviewQ.timeSpent ? String(reviewQ.timeSpent) : "00:00"
                };
            });

            const skills = this.prepareSectionSkills(sectionExamQuestions, sectionReviewQuestions);
            const sectionTime = elapsedTime && elapsedTime[sectionIndex] ? String(elapsedTime[sectionIndex]) : "00:00";

            const sectionTotal = examScoreUtils.sectionDenominator(examData, sectionIndex);
            const sectionCorrect = examScoreUtils.countCorrectInSection(sectionReviewQuestions, sectionExamQuestions);

            return {
                title: sectionData.title || `القسم ${sectionIndex + 1}`,
                score: sectionCorrect,
                totalQuestions: sectionTotal,
                correctAnswers: sectionCorrect,
                time: sectionTime,
                skills: skills,
                questions: questions
            };
        });
    },

    /**
     * Prepare skills data for a section
     * @param {Array} sectionExamQuestions - Exam questions for the section
     * @param {Array} sectionReviewQuestions - Review questions for the section
     * @returns {Array} - Skills data
     */
    prepareSectionSkills(sectionExamQuestions, sectionReviewQuestions) {
        if (!sectionExamQuestions || sectionExamQuestions.length === 0) {
            return [];
        }

        const skillsMap = new Map();

        sectionExamQuestions.forEach((examQ, index) => {
            const reviewQ = sectionReviewQuestions
                ? (sectionReviewQuestions[index] || sectionReviewQuestions.find(r => String(r?.id) === String(examQ?._id)))
                : null;
            if (!examQ?.skills) return;

            examQ.skills.forEach(skill => {
                const skillName = skill.text || skill;
                if (!skillsMap.has(skillName)) {
                    skillsMap.set(skillName, {
                        title: skillName,
                        questions: []
                    });
                }

                const isCorrect = reviewQ?.selectedAnswer != null && String(reviewQ.selectedAnswer) === String(examQ.correctAnswer);
                skillsMap.get(skillName).questions.push({ examQ, reviewQ, isCorrect });
            });
        });

        return Array.from(skillsMap.values()).map(skill => {
            const correctAnswers = skill.questions.filter(q => q.isCorrect).length;
            const totalQuestions = skill.questions.length;

            return {
                title: skill.title,
                correctAnswers,
                numberOfQuestions: totalQuestions,
                score: examScoreUtils.pct(correctAnswers, totalQuestions)
            };
        });
    },

    /**
     * Prepare section details for submission
     * @param {Object} examData - Exam data
     * @param {Array} allReviewQuestions - All review questions
     * @param {Array} allExamQuestions - All exam questions
     * @param {Array} elapsedTime - Elapsed time for each section
     * @returns {Array} - Section details
     */
    prepareSectionDetails(examData, allReviewQuestions, allExamQuestions, elapsedTime) {
        if (!examData?.sections) return []

        return examData.sections.map((sectionData, index) => {
            const sectionReview = (allReviewQuestions && allReviewQuestions[index]) || [];
            const sectionExam = (allExamQuestions && allExamQuestions[index]) || [];

            const total = examScoreUtils.sectionDenominator(examData, index);
            const correctAnswers = examScoreUtils.countCorrectInSection(sectionReview, sectionExam);

            return {
                title: sectionData?.title,
                score: examScoreUtils.pct(correctAnswers, total),
                correctAnswers,
                numberOfQuestions: total,
                time: (elapsedTime && elapsedTime[index]) || "00:00"
            };
        });
    },

    /**
     * Get exam terminations for a specific exam
     * @param {string} examId - Exam ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Exam terminations data
     */
    async getExamTerminations(examId, options = {}) {
        try {
            const body = {
                routeName: 'getExamTerminations',
                examId,
                ...options
            }
            const response = await postRouteAPI(body)
            return response
        } catch (error) {
            console.error('Error fetching exam terminations:', error)
            throw error
        }
    },

    /**
     * Delete exam termination
     * @param {string} terminationId - Termination ID
     * @returns {Promise<Object>} - Delete response
     */
    async deleteExamTermination(terminationId) {
        try {
            const body = {
                routeName: 'deleteExamTermination',
                terminationId
            }
            const response = await postAuthRouteAPI(body)
            return response
        } catch (error) {
            console.error('Error deleting exam termination:', error)
            throw error
        }
    }
} 