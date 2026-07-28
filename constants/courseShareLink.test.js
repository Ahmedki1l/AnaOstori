/**
 * Unit tests for the course share-link helpers.
 *
 * These cover the pure URL-building logic and the clipboard side effect that
 * sit behind the "نسخ الرابط" buttons. This logic is deliberately NOT tested
 * through the admin UI end-to-end: the admin page requires a Firebase
 * instructor login against the production API, and the URL строки it produces
 * are pure functions that are far cheaper and more reliable to verify here.
 * The one thing that genuinely needs the real stack — a recipient opening the
 * link and landing on the right course — is covered in e2e/shareLink.spec.js.
 */
import {
    courseShareUrl,
    customeCourseShareUrl,
    copyShareUrl,
} from './courseShareLink'

// react-toastify is a UI side effect; assert we call it, don't render it.
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}))
import { toast } from 'react-toastify'

// jsdom sets window.location.origin to http://localhost — the helpers read it.
const ORIGIN = 'http://localhost'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('courseShareUrl (regular courses)', () => {
    test('builds /{course}/{category} with spaces converted to dashes', () => {
        const course = { name: 'دورة تدريب على تجميعات', catagory: { name: 'القدرات الكمي' } }
        expect(courseShareUrl(course)).toBe(
            `${ORIGIN}/دورة-تدريب-على-تجميعات/القدرات-الكمي`
        )
    })

    test('returns null when the course has no name', () => {
        expect(courseShareUrl({ catagory: { name: 'القدرات' } })).toBeNull()
    })

    test('returns null when the course has no category', () => {
        expect(courseShareUrl({ name: 'دورة' })).toBeNull()
    })

    test('returns null for a null course rather than throwing', () => {
        expect(courseShareUrl(null)).toBeNull()
    })
})

describe('customeCourseShareUrl (custom courses)', () => {
    test('builds /customeCourses?courseId=<id>', () => {
        expect(customeCourseShareUrl('6871f2a9c4e1b8d3f0a27c15')).toBe(
            `${ORIGIN}/customeCourses?courseId=6871f2a9c4e1b8d3f0a27c15`
        )
    })
})

describe('copyShareUrl (clipboard + toast)', () => {
    test('writes the url to the clipboard and shows the success toast', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined)
        Object.assign(navigator, { clipboard: { writeText } })

        await copyShareUrl(`${ORIGIN}/customeCourses?courseId=abc`)

        expect(writeText).toHaveBeenCalledWith(`${ORIGIN}/customeCourses?courseId=abc`)
        expect(toast.success).toHaveBeenCalledTimes(1)
        expect(toast.success).toHaveBeenCalledWith(expect.any(String), { rtl: true })
        expect(toast.error).not.toHaveBeenCalled()
    })

    test('shows an error toast and never touches the clipboard for a null url', async () => {
        const writeText = jest.fn()
        Object.assign(navigator, { clipboard: { writeText } })

        await copyShareUrl(null)

        expect(writeText).not.toHaveBeenCalled()
        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.success).not.toHaveBeenCalled()
    })

    test('shows an error toast when the clipboard API is unavailable (non-HTTPS host)', async () => {
        // navigator.clipboard is undefined on insecure origins; writeText would
        // throw synchronously — copyShareUrl must catch it and toast, not crash.
        Object.assign(navigator, { clipboard: undefined })

        await expect(copyShareUrl(`${ORIGIN}/x`)).resolves.toBeUndefined()

        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.success).not.toHaveBeenCalled()
    })

    test('shows an error toast when writeText rejects (permission denied)', async () => {
        const writeText = jest.fn().mockRejectedValue(new Error('denied'))
        Object.assign(navigator, { clipboard: { writeText } })

        await copyShareUrl(`${ORIGIN}/x`)

        expect(toast.error).toHaveBeenCalledTimes(1)
        expect(toast.success).not.toHaveBeenCalled()
    })
})
