const { defineConfig, devices } = require('@playwright/test')

// E2E config. Specs live in e2e/ and drive the real Next.js app booted by
// `npm run dev`. Only the share-link *recipient* journey is covered here — it
// needs no login. The admin "نسخ الرابط" buttons require a Firebase instructor
// session against the production API, so that side is covered by the Jest unit
// tests over constants/courseShareLink.js instead (see the pyramid rationale in
// constants/courseShareLink.test.js).
module.exports = defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    // Determinism over green-washing: a flake is a defect, not something to retry past.
    retries: 0,
    reporter: [['list']],
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        // First compile of this app (MUI + many providers) is slow; give it room.
        timeout: 180 * 1000,
    },
})
