import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github'] as ['github']] : []),
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://petstore.swagger.io/v2/',
    extraHTTPHeaders: {
      // Content-Type is intentionally excluded here so Playwright can set it
      // correctly per-request (application/json, multipart/form-data, etc.)
      Accept: 'application/json',
    },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'pet-api',
      testMatch: 'tests/api/pet/**/*.spec.ts',
    },
  ],
});
