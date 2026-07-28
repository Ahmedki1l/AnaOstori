// End-to-end coverage for the custom-course share link — the recipient side.
//
// Journey under test (the only genuinely E2E-worthy one for this feature):
//   An instructor copies /customeCourses?courseId=<id>; a recipient opens it
//   and lands on the public page with THAT course highlighted, the rest of the
//   list still shown. This is the "wiring" — router query -> fetch -> the
//   highlight effect in pages/customeCourses/index.js -> the rendered card.
//
// Hermetic by construction: the backend /get-any call is stubbed with fixtures
// (page.route), so the test never touches the production API and is fully
// deterministic. External trackers are aborted for the same reason. The clipboard
// half of the feature lives on a login-gated admin page and is covered by the
// Jest unit tests over constants/courseShareLink.js instead.
const { test, expect } = require('@playwright/test')

// Two fixture courses shaped exactly like a real customeCourses Mongo document
// (createMongoDBCourse.js writes _id/title/day/cost/appointments[]).
const COURSE_A = {
    _id: 'aaaaaaaaaaaaaaaaaaaaaaa1',
    title: 'دورة تدريب على تجميعات الكمي',
    day: 'السبت 18 يوليو - الأربعاء 29 يوليو',
    cost: 699,
    appointments: [
        { id: 'appt-a-1', from: '4:00 م', to: '6:00 م', availableSeats: 5 },
    ],
}
const COURSE_B = {
    _id: 'bbbbbbbbbbbbbbbbbbbbbbb2',
    title: 'دورة تدريب على اللفظي',
    day: 'الأحد 19 يوليو',
    cost: 550,
    appointments: [
        { id: 'appt-b-1', from: '7:00 م', to: '9:00 م', availableSeats: 3 },
    ],
}

const TRACKER_HOSTS = /(googletagmanager|google-analytics|connect\.facebook|facebook\.com\/tr|analytics\.tiktok|tr\.snapchat|sc-static)/

// Minimal page object: intent-revealing access to the cards, so a DOM change
// updates one place instead of every assertion.
function customeCoursesPage(page) {
    return {
        stubHits: { count: 0 },
        async open(query = '') {
            await page.goto(`/customeCourses${query}`)
            // Wait on the condition (cards rendered), never on the clock.
            await expect(page.locator('[id^="course-"]').first()).toBeVisible()
        },
        card(id) {
            return page.locator(`#course-${id}`)
        },
    }
}

test.beforeEach(async ({ page }) => {
    // Stub the only backend call the public page makes, regardless of host.
    await page.route('**/get-any**', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([COURSE_A, COURSE_B]),
        })
    })
    // Keep the test off the live network for analytics/pixels.
    await page.route(TRACKER_HOSTS, route => route.abort())
})

test('share link highlights the linked course and keeps the rest of the list', async ({ page }) => {
    let getAnyCalls = 0
    await page.route('**/get-any**', async route => {
        getAnyCalls += 1
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([COURSE_A, COURSE_B]),
        })
    })

    const coursesPage = customeCoursesPage(page)
    await coursesPage.open(`?courseId=${COURSE_B._id}`)

    // The linked course is highlighted (CSS-module class contains "highlighted").
    await expect(coursesPage.card(COURSE_B._id)).toHaveClass(/highlighted/)
    // The other course is present but NOT highlighted — the list isn't filtered.
    await expect(coursesPage.card(COURSE_A._id)).toBeVisible()
    await expect(coursesPage.card(COURSE_A._id)).not.toHaveClass(/highlighted/)
    await expect(page.getByText(COURSE_A.title)).toBeVisible()
    await expect(page.getByText(COURSE_B.title)).toBeVisible()

    // Guard: the fixture was actually served — the test never silently hit prod.
    expect(getAnyCalls).toBeGreaterThan(0)
})

test('a deleted or garbage courseId shows the full list with nothing highlighted', async ({ page }) => {
    const coursesPage = customeCoursesPage(page)
    await coursesPage.open('?courseId=deadbeefdeadbeefdeadbeef')

    // No crash, full list rendered, nothing highlighted.
    await expect(coursesPage.card(COURSE_A._id)).toBeVisible()
    await expect(coursesPage.card(COURSE_B._id)).toBeVisible()
    await expect(page.locator('[id^="course-"]')).toHaveCount(2)
    for (const id of [COURSE_A._id, COURSE_B._id]) {
        await expect(coursesPage.card(id)).not.toHaveClass(/highlighted/)
    }
})

test('no courseId param renders the plain list with nothing highlighted', async ({ page }) => {
    const coursesPage = customeCoursesPage(page)
    await coursesPage.open()

    await expect(page.locator('[id^="course-"]')).toHaveCount(2)
    await expect(coursesPage.card(COURSE_A._id)).not.toHaveClass(/highlighted/)
    await expect(coursesPage.card(COURSE_B._id)).not.toHaveClass(/highlighted/)
})
