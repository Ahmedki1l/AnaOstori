import { getRouteAPI, postAuthRouteAPI, getAuthRouteAPI } from './apisService'
import { getNewToken } from './fireBaseAuthService'

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
     * @param {Object} options - Additional options (termination info, etc.)
     * @returns {Promise<Object>} - API response
     */
    async submitExamResults(examData, results, examId, studentId, options = {}) {
        try {
            const examResultData = {
                routeName: 'submitExamResult',
                examId: examId,
                studentId: studentId,
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
                    isCompleted: !options.isTerminated,
                    isTerminated: options.isTerminated || false,
                    terminationReason: options.terminationReason || null,
                    submissionType: options.isTerminated ? 'terminated' : 'completed'
                }
            }

            const response = await postAuthRouteAPI(examResultData)
            console.log('Exam results submitted successfully:', response)
            return response
        } catch (error) {
            console.error('Error submitting exam results:', error)
            
            // Handle token refresh
            if (error?.response?.status === 401) {
                try {
                    await getNewToken()
                    return await this.submitExamResults(examData, results, examId, studentId, options)
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError)
                    throw refreshError
                }
            }
            
            throw error
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
            
            // Handle the new backend response structure
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

            return responseData.data && responseData.data.length > 0
        } catch (error) {
            // If no result found, student hasn't taken the exam
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

        const totalQuestions = flatReviewQuestions.length;
        let correctAnswers = 0;
        let unAnswered = 0;
        let marked = 0;

        // Map reviewQuestions to required schema and count correct answers
        const reviewQuestions = flatReviewQuestions.map((q, index) => {
            const examQ = flatExamQuestions[index] || {};
            const isCorrect = q.selectedAnswer === examQ.correctAnswer;
            if (isCorrect) correctAnswers++;
            if (!q.answered) unAnswered++;
            if (q.isMarked) marked++;

            return {
                questionId: typeof q.id === 'string' ? q.id : (q.id ? String(q.id) : ''),
                selectedAnswer: typeof q.selectedAnswer === 'string' ? q.selectedAnswer : (q.selectedAnswer ? String(q.selectedAnswer) : ''),
                isCorrect,
                isMarked: !!q.isMarked,
                answered: !!q.answered,
                timeSpent: q.timeSpent ? String(q.timeSpent) : "00:00"
            };
        });

        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        const results = {
            totalQuestions,
            score,
            correctQuestions: correctAnswers,
            wrongQuestions: totalQuestions - correctAnswers - unAnswered,
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
        if (!examData?.sections || !allReviewQuestions || allReviewQuestions.length === 0) {
            return [];
        }

        return allReviewQuestions.map((sectionReviewQuestions, sectionIndex) => {
            const sectionExamQuestions = allExamQuestions[sectionIndex] || [];
            const sectionData = examData.sections[sectionIndex] || {};
            
            // Calculate correct answers for this section
            let correctAnswers = 0;
            
            // Prepare nested questions array with all required fields
            const questions = sectionReviewQuestions.map((reviewQ, questionIndex) => {
                const examQ = sectionExamQuestions[questionIndex] || {};
                const isCorrect = reviewQ.selectedAnswer === examQ.correctAnswer;
                
                if (isCorrect) correctAnswers++;
                
                return {
                    questionId: typeof reviewQ.id === 'string' ? reviewQ.id : (reviewQ.id ? String(reviewQ.id) : ''),
                    correctAnswer: examQ.correctAnswer ? String(examQ.correctAnswer) : '',
                    selectedAnswer: typeof reviewQ.selectedAnswer === 'string' ? reviewQ.selectedAnswer : (reviewQ.selectedAnswer ? String(reviewQ.selectedAnswer) : ''),
                    isCorrect,
                    isMarked: !!reviewQ.isMarked,
                    answered: !!reviewQ.answered,
                    timeSpent: reviewQ.timeSpent ? String(reviewQ.timeSpent) : "00:00"
                };
            });
            
            // Prepare skills data
            const skills = this.prepareSectionSkills(sectionExamQuestions, sectionReviewQuestions);
            
            // Get time for this section - ensure last section has correct time
            const sectionTime = elapsedTime && elapsedTime[sectionIndex] ? String(elapsedTime[sectionIndex]) : "00:00";
            
            return {
                title: sectionData.title || `القسم ${sectionIndex + 1}`,
                score: correctAnswers,
                totalQuestions: sectionReviewQuestions.length,
                correctAnswers: correctAnswers,
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

        // Group questions by skill
        const skillsMap = new Map();

        sectionExamQuestions.forEach((examQ, index) => {
            const reviewQ = sectionReviewQuestions[index];
            if (!examQ?.skills) return;

            examQ.skills.forEach(skill => {
                const skillName = skill.text || skill;
                if (!skillsMap.has(skillName)) {
                    skillsMap.set(skillName, {
                        title: skillName,
                        questions: []
                    });
                }

                skillsMap.get(skillName).questions.push({
                    examQ,
                    reviewQ,
                    isCorrect: reviewQ?.selectedAnswer === examQ.correctAnswer
                });
            });
        });

        // Calculate scores for each skill
        return Array.from(skillsMap.values()).map(skill => {
            const correctAnswers = skill.questions.filter(q => q.isCorrect).length;
            const totalQuestions = skill.questions.length;

            return {
                title: skill.title,
                correctAnswers: correctAnswers,
                numberOfQuestions: totalQuestions,
                score: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
            };
        });
    },

    /**
     * Prepare sections data for submission (OLD STRUCTURE - kept for reference)
     * @param {Object} examData - Exam data
     * @param {Array} allReviewQuestions - All review questions
     * @param {Array} allExamQuestions - All exam questions
     * @returns {Array} - Sections data
     */
    prepareSectionsData(examData, allReviewQuestions, allExamQuestions) {
        const flatExamQuestions = allExamQuestions.flat();
        const flatReviewQuestions = allReviewQuestions.flat();
    
        if (!flatExamQuestions || !flatReviewQuestions || flatReviewQuestions.length === 0) {
            return [];
        }
    
        const sectionMap = new Map();
    
        flatExamQuestions.forEach((question, index) => {
            question?.skills?.forEach(skill => {
                const sectionTitle = question?.section + " - " + question?.lesson;
    
                if (!sectionMap.has(sectionTitle)) {
                    sectionMap.set(sectionTitle, {
                        title: sectionTitle,
                        questions: [],
                        skills: new Map()
                    });
                }
    
                const section = sectionMap.get(sectionTitle);
                section.questions.push({
                    question,
                    selectedAnswer: flatReviewQuestions?.[index]?.selectedAnswer ?? null,
                    skill: skill.text
                });
    
                if (!section.skills.has(skill.text)) {
                    section.skills.set(skill.text, []);
                }
                section.skills.get(skill.text).push({
                    question,
                    selectedAnswer: flatReviewQuestions?.[index]?.selectedAnswer ?? null
                });
            });
        });
    
        return Array.from(sectionMap.values()).map(section => {
            const correctInSection = section.questions.filter(q =>
                q.selectedAnswer === q.question.correctAnswer
            ).length;
    
            const skills = Array.from(section.skills.entries()).map(([skillTitle, questions]) => {
                const correctInSkill = questions.filter(q =>
                    q.selectedAnswer === q.question.correctAnswer
                ).length;
    
                return {
                    title: skillTitle,
                    correctAnswers: correctInSkill,
                    numberOfQuestions: questions.length,
                    score: Math.round((correctInSkill / questions.length) * 100)
                };
            });
    
            return {
                title: section.title,
                score: correctInSection,
                totalQuestions: section.questions.length,
                skills: skills
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
        if (!examData?.sections || !allReviewQuestions || allReviewQuestions.length === 0) return []

        return allReviewQuestions.map((sectionQuestions, index) => {
            let correctAnswers = 0;
            sectionQuestions.forEach((question, i) => {
                const questionIndex = allExamQuestions[index]?.findIndex(q => q._id === question.id);
                if (questionIndex >= 0 && question?.selectedAnswer === allExamQuestions[index][questionIndex]?.correctAnswer) {
                    correctAnswers++;
                }
            });

            const sectionScore = Math.round((correctAnswers / sectionQuestions.length) * 100);

            return {
                title: examData?.sections[index]?.title,
                score: sectionScore || 0,
                correctAnswers: correctAnswers || 0,
                numberOfQuestions: sectionQuestions?.length || 0,
                time: elapsedTime[index] || "00:00"
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