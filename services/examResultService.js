import { getRouteAPI, postAuthRouteAPI } from './apisService'
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
                    examName: examData.name,
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
     * Check if student has already taken this exam
     * @param {string} examId - Exam ID
     * @param {string} studentId - Student ID
     * @returns {Promise<boolean>} - Whether student has taken the exam
     */
    async hasStudentTakenExam(examId, studentId) {
        try {
            const result = await this.getStudentExamResult(examId, studentId)
            
            // Handle the new backend response structure
            const responseData = result.data || result.body ? JSON.parse(result.body || result.data) : result
            
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
        const flatReviewQuestions = allReviewQuestions.flat()
        const flatExamQuestions = allExamQuestions.flat()

        const totalQuestions = flatReviewQuestions.length
        const correctAnswers = flatReviewQuestions.filter((question, index) => 
            question.selectedAnswer === flatExamQuestions[index]?.correctAnswer
        ).length

        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

        const results = {
            totalQuestions,
            score,
            correctQuestions: correctAnswers,
            wrongQuestions: totalQuestions - correctAnswers,
            unansweredQuestions: flatReviewQuestions.filter(q => !q.answered).length,
            markedQuestions: flatReviewQuestions.filter(q => q.isMarked).length,
            timeSpent: this.calculateTotalTime(elapsedTime),
            totalTime: examData.duration + ":00",
            sections: this.prepareSectionsData(examData, allReviewQuestions, allExamQuestions),
            sectionDetails: this.prepareSectionDetails(examData, allReviewQuestions, allExamQuestions, elapsedTime),
            reviewQuestions: flatReviewQuestions,
            distractionEvents,
            distractionStrikes,
            examDate: new Date().toISOString()
        }

        return results
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

        while (totalSeconds > 59) {
            totalMinutes++
            totalSeconds -= 60
        }

        return `${totalMinutes.toString().padStart(2, '0')}:${totalSeconds.toString().padStart(2, '0')}`
    },

    /**
     * Prepare sections data for submission
     * @param {Object} examData - Exam data
     * @param {Array} allReviewQuestions - All review questions
     * @param {Array} allExamQuestions - All exam questions
     * @returns {Array} - Sections data
     */
    prepareSectionsData(examData, allReviewQuestions, allExamQuestions) {
        if (!examData?.sections) return []

        return examData.sections.map((section, sectionIndex) => {
            const sectionQuestions = allReviewQuestions[sectionIndex] || []
            const sectionExamQuestions = allExamQuestions[sectionIndex] || []

            const correctInSection = sectionQuestions.filter((question, index) => 
                question.selectedAnswer === sectionExamQuestions[index]?.correctAnswer
            ).length

            return {
                title: section.title,
                score: correctInSection,
                totalQuestions: sectionQuestions.length,
                skills: this.prepareSkillsData(section, sectionQuestions, sectionExamQuestions)
            }
        })
    },

    /**
     * Prepare skills data for a section
     * @param {Object} section - Section data
     * @param {Array} sectionQuestions - Section questions
     * @param {Array} sectionExamQuestions - Section exam questions
     * @returns {Array} - Skills data
     */
    prepareSkillsData(section, sectionQuestions, sectionExamQuestions) {
        if (!section.skills) return []

        return section.skills.map(skill => {
            const skillQuestions = sectionQuestions.filter((_, index) => 
                sectionExamQuestions[index]?.skills?.some(s => s.text === skill.text)
            )

            const correctInSkill = skillQuestions.filter((question, index) => 
                question.selectedAnswer === sectionExamQuestions[index]?.correctAnswer
            ).length

            return {
                title: skill.text,
                correctAnswers: correctInSkill,
                numberOfQuestions: skillQuestions.length,
                score: skillQuestions.length > 0 ? Math.round((correctInSkill / skillQuestions.length) * 100) : 0
            }
        })
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

        return examData.sections.map((section, sectionIndex) => {
            const sectionQuestions = allReviewQuestions[sectionIndex] || []
            const sectionExamQuestions = allExamQuestions[sectionIndex] || []

            const correctAnswers = sectionQuestions.filter((question, index) => 
                question.selectedAnswer === sectionExamQuestions[index]?.correctAnswer
            ).length

            const sectionScore = sectionQuestions.length > 0 ? Math.round((correctAnswers / sectionQuestions.length) * 100) : 0

            return {
                title: section.title,
                score: sectionScore,
                correctAnswers,
                numberOfQuestions: sectionQuestions.length,
                time: elapsedTime[sectionIndex] || "00:00"
            }
        })
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