import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration – Acceptance Tests
 * Plateforme PF-FST-SBZ · TP4
 */
export default defineConfig({
  testDir: './tests/acceptance',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    headless: true,
  },

  projects: [
    {
      name: 'Chromium – Desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      VITE_SUPABASE_URL:      'https://glqkyojqftnqwnsmicwi.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscWt5b2pxZnRucXduc21pY3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjA5NzIsImV4cCI6MjA5MjUzNjk3Mn0.eh5Yn8wkL_IALx7MUw7yhO5gjqkTqbNb_VzjkhL_DD8',
    },
  },
});
