import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration – Acceptance Tests
 * Plateforme PF-FST-SBZ · TP4
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Répertoire contenant les specs
  testDir: './tests/acceptance',

  // Timeout global par test (10s suffisent pour les tests UI purs)
  timeout: 30_000,

  // Timeout des assertions expect()
  expect: {
    timeout: 5_000,
  },

  // Chaque test est indépendant
  fullyParallel: true,

  // Empêcher les .only en CI
  forbidOnly: !!process.env.CI,

  // Pas de retry en local, 1 retry en CI
  retries: process.env.CI ? 1 : 0,

  // Travailleurs parallèles
  workers: process.env.CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    // Format JUnit pour intégration CI
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    // URL de base du serveur de prévisualisation Vite
    baseURL: process.env.BASE_URL || 'http://localhost:4173',

    // Screenshot en cas d'échec
    screenshot: 'only-on-failure',

    // Trace en cas d'échec (utile pour le débogage CI)
    trace: 'on-first-retry',

    // Pas de headless forcé en local
    headless: true,
  },

  projects: [
    {
      name: 'Chromium – Desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    // Activer Firefox/Safari si besoin :
    // { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'Safari',  use: { ...devices['Desktop Safari']  } },
  ],

  // Démarrer le serveur Vite Preview automatiquement si pas déjà en cours
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Variables d'environnement Firebase fictives pour les tests UI
    env: {
      VITE_FIREBASE_API_KEY:              'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN:          'test-project.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID:           'test-project',
      VITE_FIREBASE_STORAGE_BUCKET:       'test-project.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID:  '000000000000',
      VITE_FIREBASE_APP_ID:               '1:000000000000:web:000000000000000000000000',
    },
  },
});
