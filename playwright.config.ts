import { defineConfig, devices } from "@playwright/test";

// Ensure config loads even if local TypeScript/ESLint resolution has issues.
// The baseURL port (3001) aligns with webServer command below.
const useProd = !!process.env.PLAYWRIGHT_PROD;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["line"]] : [["line"]],
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: useProd
    ? {
        command: "npm run build && PORT=3001 npm run start",
        port: 3001,
        reuseExistingServer: false,
        timeout: 180 * 1000,
      }
    : {
        command: "npm run dev -- -p 3001",
        port: 3001,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
