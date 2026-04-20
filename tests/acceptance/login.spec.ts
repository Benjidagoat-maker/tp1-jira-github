/**
 * Tests d'acceptation – Page de connexion (/login)
 * Plateforme PF-FST-SBZ · TP4 Automatisation
 *
 * Portage Node.js/Playwright du projet Java/Cucumber :
 *   pf2026/site_vente_en_ligne (Selenium + JUnit)
 *
 * Structure BDD : chaque describe = Feature, chaque test = Scenario.
 * Les étapes Given/When/Then sont réifiées en helpers locaux
 * pour reproduire fidèlement la lisibilité Gherkin.
 *
 * US couvertes : SCRUM-11, SCRUM-14, SCRUM-18
 */

import { test, expect, type Page } from '@playwright/test';

// ── URL de base (injectée par playwright.config.ts) ──────────────────
const LOGIN_PATH = '/login';

// ── Helpers BDD ──────────────────────────────────────────────────────

/** Given : naviguer sur la page login */
async function givenUserIsOnLoginPage(page: Page) {
  await page.goto(LOGIN_PATH);
  // Attendre que le formulaire React soit monté
  await page.waitForSelector('form', { timeout: 10_000 });
}

/** Given : être en mode inscription */
async function givenUserIsInSignupMode(page: Page) {
  await givenUserIsOnLoginPage(page);
  await page.getByText("Pas de compte ? S'inscrire").click();
  await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
}

/** When : sélectionner un rôle dans le <select> */
async function whenUserSelectsRole(page: Page, role: string) {
  await page.getByLabel('Rôle').selectOption({ label: role });
}

/** When : saisir dans un champ de formulaire */
async function whenUserTypesInField(page: Page, selector: string, value: string) {
  const field = page.locator(selector);
  await field.clear();
  await field.fill(value);
}

/** When : cliquer sur un bouton par son texte */
async function whenUserClicksButton(page: Page, label: string) {
  await page.getByRole('button', { name: label }).click();
}

// ── Feature : rendu & éléments de la page ────────────────────────────
test.describe('Feature: Page de connexion – Rendu initial', () => {

  /**
   * Scenario 1 : La page affiche tous les éléments requis
   * Given / When / Then
   */
  test('Scenario 1 – Tous les éléments de la page de connexion sont visibles', async ({ page }) => {
    // GIVEN l'utilisateur est sur la page "/login"
    await givenUserIsOnLoginPage(page);

    // WHEN la page est complètement chargée (implicite : waitForSelector ci-dessus)

    // THEN tous les éléments clés sont visibles
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByLabel('Rôle')).toBeVisible();
    await expect(page.getByLabel('Adresse email')).toBeVisible();
    await expect(page.getByPlaceholder('Minimum 6 caractères')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    await expect(page.getByText('Mot de passe oublié ?')).toBeVisible();
    await expect(page.getByText("Pas de compte ? S'inscrire")).toBeVisible();
  });

});

// ── Feature : validation du formulaire ───────────────────────────────
test.describe('Feature: Validation du formulaire de connexion', () => {

  /**
   * Scenario 2 : Soumission vide → messages d'erreur
   */
  test('Scenario 2 – Formulaire vide affiche les erreurs de validation', async ({ page }) => {
    // GIVEN le formulaire de connexion est vide
    await givenUserIsOnLoginPage(page);

    // WHEN l'utilisateur clique sur "Se connecter" sans rien remplir
    await whenUserClicksButton(page, 'Se connecter');

    // THEN les messages d'erreur Zod apparaissent
    await expect(page.getByText('Email requis')).toBeVisible();
    await expect(page.getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();

    // AND l'utilisateur reste sur /login
    expect(page.url()).toContain(LOGIN_PATH);
  });

  /**
   * Scenario 3 : Email invalide → erreur de format
   */
  test('Scenario 3 – Email au format invalide est rejeté', async ({ page }) => {
    // GIVEN
    await givenUserIsOnLoginPage(page);
    await whenUserSelectsRole(page, 'Étudiant');

    // WHEN l'utilisateur saisit un email malformé
    await whenUserTypesInField(page, 'input[type="email"]', 'email-invalide');
    await whenUserTypesInField(page, 'input[placeholder="Minimum 6 caractères"]', 'motdepasse123');
    await whenUserClicksButton(page, 'Se connecter');

    // THEN l'erreur de format apparaît
    await expect(page.getByText('Adresse email invalide')).toBeVisible();
    expect(page.url()).toContain(LOGIN_PATH);
  });

  /**
   * Scenario 4 : Mot de passe trop court
   */
  test('Scenario 4 – Mot de passe de moins de 6 caractères est rejeté', async ({ page }) => {
    // GIVEN
    await givenUserIsOnLoginPage(page);
    await whenUserSelectsRole(page, 'Étudiant');

    // WHEN
    await whenUserTypesInField(page, 'input[type="email"]', 'ahmed@fstsbz.u-kairouan.tn');
    await whenUserTypesInField(page, 'input[placeholder="Minimum 6 caractères"]', 'abc');
    await whenUserClicksButton(page, 'Se connecter');

    // THEN
    await expect(page.getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();
  });

});

// ── Feature : sélection des rôles ────────────────────────────────────
test.describe('Feature: Sélection des rôles disponibles', () => {

  const roles = [
    'Étudiant',
    'Tuteur',
    'Coordinateur pédagogique',
    'Membre du Jury',
  ];

  for (const role of roles) {
    /**
     * Scenario 5 (Outline) : Chaque rôle peut être sélectionné
     */
    test(`Scenario 5 – Rôle "${role}" est sélectionnable`, async ({ page }) => {
      // GIVEN
      await givenUserIsOnLoginPage(page);

      // WHEN l'utilisateur sélectionne le rôle
      await whenUserSelectsRole(page, role);

      // THEN l'option est bien sélectionnée
      const select = page.getByLabel('Rôle');
      await expect(select).toHaveValue(
        role === 'Étudiant' ? 'etudiant'
        : role === 'Tuteur' ? 'tuteur'
        : role === 'Coordinateur pédagogique' ? 'coordinateur'
        : 'jury'
      );
    });
  }

});

// ── Feature : navigation entre les modes ─────────────────────────────
test.describe('Feature: Navigation dans la page de connexion', () => {

  /**
   * Scenario 6 : Bascule vers le formulaire d'inscription
   */
  test("Scenario 6 – Bascule vers le mode inscription", async ({ page }) => {
    // GIVEN l'utilisateur est en mode connexion
    await givenUserIsOnLoginPage(page);
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();

    // WHEN il clique sur le lien d'inscription
    await page.getByText("Pas de compte ? S'inscrire").click();

    // THEN le titre change et le bouton s'adapte
    await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
    await expect(page.getByRole('button', { name: "S'inscrire" })).toBeVisible();
    // AND "Mot de passe oublié ?" disparaît en mode inscription
    await expect(page.getByText('Mot de passe oublié ?')).not.toBeVisible();
  });

  /**
   * Scenario 7 : Accès à la réinitialisation du mot de passe (SCRUM-14)
   */
  test('Scenario 7 – Accès au formulaire de réinitialisation du mot de passe (SCRUM-14)', async ({ page }) => {
    // GIVEN l'utilisateur est sur la page de connexion
    await givenUserIsOnLoginPage(page);

    // WHEN il clique sur "Mot de passe oublié ?"
    await page.getByText('Mot de passe oublié ?').click();

    // THEN la vue de réinitialisation s'affiche
    await expect(page.getByRole('heading', { name: 'Mot de passe oublié' })).toBeVisible();
    await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Envoyer le lien de réinitialisation' })).toBeVisible();
  });

  /**
   * Scenario 8 : Retour depuis la réinitialisation vers la connexion
   */
  test('Scenario 8 – Retour depuis "Mot de passe oublié" vers la connexion', async ({ page }) => {
    // GIVEN l'utilisateur est sur la vue de réinitialisation
    await givenUserIsOnLoginPage(page);
    await page.getByText('Mot de passe oublié ?').click();
    await expect(page.getByRole('heading', { name: 'Mot de passe oublié' })).toBeVisible();

    // WHEN il clique sur "Retour à la connexion"
    await page.getByText('Retour à la connexion').click();

    // THEN le formulaire de connexion réapparaît
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByPlaceholder('Minimum 6 caractères')).toBeVisible();
  });

  /**
   * Scenario 9 : Lien retour "Accueil" depuis le header
   */
  test('Scenario 9 – Le lien Accueil ramène sur la page principale', async ({ page }) => {
    // GIVEN
    await givenUserIsOnLoginPage(page);

    // WHEN l'utilisateur clique sur "Accueil" dans le header
    await page.getByRole('link', { name: 'Accueil' }).click();

    // THEN il est redirigé vers la page racine
    await page.waitForURL('/');
    expect(page.url()).not.toContain('/login');
  });

});

// ── Feature : comportement du champ mot de passe ─────────────────────
test.describe('Feature: Champ mot de passe', () => {

  /**
   * Scenario 10 : Afficher / masquer le mot de passe
   */
  test('Scenario 10 – Bascule de visibilité du mot de passe', async ({ page }) => {
    // GIVEN l'utilisateur a saisi un mot de passe
    await givenUserIsOnLoginPage(page);
    const pwdField = page.getByPlaceholder('Minimum 6 caractères');
    await pwdField.fill('secret123');

    // THEN le champ est de type "password" par défaut
    await expect(pwdField).toHaveAttribute('type', 'password');

    // WHEN il clique sur l'icône "afficher"
    await page.locator('button[type="button"]').filter({ has: page.locator('svg') }).click();

    // THEN le champ devient de type "text"
    await expect(pwdField).toHaveAttribute('type', 'text');

    // WHEN il clique à nouveau
    await page.locator('button[type="button"]').filter({ has: page.locator('svg') }).click();

    // THEN le champ redevient "password"
    await expect(pwdField).toHaveAttribute('type', 'password');
  });

  /**
   * Scenario 11 : Indicateur de force du mot de passe (mode inscription)
   */
  test('Scenario 11 – Indicateur de force du mot de passe en mode inscription', async ({ page }) => {
    // GIVEN l'utilisateur est en mode inscription
    await givenUserIsInSignupMode(page);
    const pwdField = page.getByPlaceholder('Minimum 6 caractères');

    // WHEN il saisit un mot de passe faible
    await pwdField.fill('abc');

    // THEN l'indicateur affiche un message d'avertissement
    await expect(page.getByText('You need a stronger password.')).toBeVisible();

    // WHEN il saisit un mot de passe fort
    await pwdField.fill('MonMotDePasse123!');

    // THEN l'indicateur affiche un message positif
    await expect(page.getByText('Mot de passe fort !')).toBeVisible();
  });

});
