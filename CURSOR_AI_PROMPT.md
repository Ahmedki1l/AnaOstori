# Cursor AI Prompt: Student Exam Results Backend Implementation

## Task Description
Implement a backend endpoint that allows students to retrieve their exam results in a hierarchical folder structure. The endpoint should group exam results by subjects/courses (folders), then by individual exams, and finally by the student's performance results.

## Technical Requirements

### Endpoint Details
- **Method**: `POST`
- **URL**: `/auth/route/fetch`
- **Route Name**: `getStudentAllExamResults`
- **Authentication**: Required (Student token validation)

### Request Format
```json
{
  "routeName": "getStudentAllExamResults"
}
```

### Expected Response Structure
The response should return a hierarchical structure with folders (subjects/courses) containing exams, and exams containing results:

```json
{
  "success": true,
  "message": "Exam results retrieved successfully",
  "data": [
    {
      "id": "folder_1",
      "name": "الرياضيات",
      "description": "اختبارات مادة الرياضيات",
      "examCount": 3,
      "exams": [
        {
          "id": "exam_1",
          "name": "اختبار الجبر",
          "description": "اختبار شامل في الجبر",
          "resultCount": 2,
          "results": [
            {
              "id": "result_1",
              "examDate": "2024-01-15T10:00:00Z",
              "score": 85,
              "status": "pass",
              "totalQuestions": 20,
              "correctAnswers": 17,
              "wrongAnswers": 2,
              "unansweredQuestions": 1,
              "timeSpent": "45:30",
              "isTerminated": false,
              "terminationReason": null,
              "sections": [
                {
                  "title": "المعادلات الخطية",
                  "score": 8,
                  "totalQuestions": 10,
                  "skills": [
                    {
                      "title": "حل المعادلات",
                      "correctAnswers": 4,
                      "numberOfQuestions": 5
                    }
                  ]
                }
              ],
              "reviewQuestions": [
                {
                  "isCorrect": true,
                  "isMarked": false,
                  "timeSpent": "2:15"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Implementation Requirements

### 1. Authentication & Authorization
- Verify the request includes a valid student authentication token
- Ensure the token belongs to a student (not instructor/admin)
- Return appropriate HTTP status codes (401 for unauthorized, 403 for forbidden)

### 2. Data Retrieval & Processing
- Fetch all exam results for the authenticated student
- Join with exam and course/subject tables to get complete information
- Group results by subject/course (folders)
- Calculate summary statistics:
  - `examCount`: Total exams in each folder
  - `resultCount`: Total results for each exam

### 3. Data Organization
- **Primary Grouping**: By subject/course (folders)
- **Secondary Grouping**: By exam within each folder
- **Tertiary Grouping**: By result within each exam

### 4. Business Logic
- **Score Calculation**: `(correctAnswers / totalQuestions) * 100`
- **Status Determination**: 
  - `pass`: score >= 60 (or your institution's passing threshold)
  - `fail`: score < 60
- **Time Formatting**: Convert seconds to "MM:SS" format

### 5. Sorting & Ordering
- **Folders**: Alphabetical by name
- **Exams**: By creation date (newest first)
- **Results**: By exam date (newest first)

## Database Structure (Expected)
Based on the existing exam system, you should have tables like:
- `exam_results` - stores student exam performance
- `exams` - stores exam information
- `courses` or `subjects` - stores course/subject information
- `exam_sections` - stores section breakdowns
- `exam_skills` - stores skill breakdowns

## Key Implementation Points

### 1. Error Handling
- Handle cases where no results exist (return empty array with success true)
- Proper error messages for authentication failures
- Graceful handling of missing or corrupted data

### 2. Performance Optimization
- Use efficient JOIN queries
- Consider adding database indexes if needed
- Implement basic caching if possible

### 3. Data Validation
- Ensure all required fields are present
- Validate data types and formats
- Handle edge cases (null values, missing relationships)

## Example Database Query Structure
```sql
-- Get student's exam results with course/subject info
SELECT 
    er.id as result_id,
    er.score,
    er.exam_date,
    er.total_questions,
    er.correct_answers,
    er.wrong_answers,
    er.unanswered_questions,
    er.time_spent,
    er.is_terminated,
    er.termination_reason,
    e.id as exam_id,
    e.name as exam_name,
    e.description as exam_description,
    c.id as course_id,
    c.name as course_name,
    c.description as course_description
FROM exam_results er
JOIN exams e ON er.exam_id = e.id
JOIN courses c ON e.course_id = c.id
WHERE er.student_id = :student_id
ORDER BY c.name, e.created_at DESC, er.exam_date DESC;
```

## Implementation Steps

### 1. Create Route Handler
- Add the new route to your existing route system
- Implement the `getStudentAllExamResults` handler function

### 2. Authentication Middleware
- Use existing authentication system
- Verify user is a student
- Extract student ID from token

### 3. Data Processing Logic
- Fetch raw data from database
- Group and organize data hierarchically
- Calculate statistics and summaries
- Format response according to specification

### 4. Error Handling
- Implement try-catch blocks
- Return appropriate HTTP status codes
- Provide meaningful error messages

### 5. Testing
- Test with various student scenarios
- Verify authentication works correctly
- Test error handling paths

## Notes
- This endpoint should be consistent with your existing API patterns
- Use the same response format as other endpoints in your system
- Ensure proper security measures are in place
- Consider implementing basic logging for debugging

## Questions to Consider
1. What is your current database schema for exam results?
2. Do you have existing authentication middleware for students?
3. What is your preferred error handling approach?
4. Do you need to implement any specific caching strategy?
5. Are there any existing exam result endpoints I should reference?

Please implement this endpoint following your existing code patterns and architecture. If you need clarification on any part, please ask!
