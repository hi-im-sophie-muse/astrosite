import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'desk', use: { ...devices['Desktop Chrome'] } },
    { name: 'pocket', use: { ...devices['Pixel 7'] } },
  ],
});