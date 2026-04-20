# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Feature: Validation du formulaire de connexion >> Scenario 3 – Email au format invalide est rejeté
- Location: tests\acceptance\login.spec.ts:102:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Adresse email invalide')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Adresse email invalide')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "Accueil" [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e6]
      - text: Accueil
  - generic [ref=e9]:
    - generic [ref=e10]:
      - img [ref=e12]
      - generic [ref=e14]:
        - heading "Connexion" [level=1] [ref=e15]
        - paragraph [ref=e16]: Plateforme PF - FST-SBZ
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: Rôle
          - combobox "Rôle" [ref=e21]:
            - option "Sélectionnez votre rôle"
            - option "Étudiant" [selected]
            - option "Tuteur"
            - option "Coordinateur pédagogique"
            - option "Membre du Jury"
        - generic [ref=e22]:
          - generic [ref=e23]: Adresse email
          - textbox "Adresse email" [active] [ref=e24]:
            - /placeholder: votre@email.com
            - text: email-invalide
        - generic [ref=e25]:
          - generic [ref=e26]: Mot de passe
          - generic [ref=e27]:
            - textbox "Mot de passe" [ref=e28]:
              - /placeholder: Minimum 6 caractères
              - text: motdepasse123
            - button [ref=e29] [cursor=pointer]:
              - img [ref=e30]
        - button "Se connecter" [ref=e33] [cursor=pointer]
      - generic [ref=e34]:
        - button "Pas de compte ? S'inscrire" [ref=e35] [cursor=pointer]
        - button "Mot de passe oublié ?" [ref=e36] [cursor=pointer]
    - paragraph [ref=e37]: Projet Fédéré SI2 - Université de Kairouan
```

# Test source

```ts
  13  |  */
  14  | 
  15  | import { test, expect, type Page } from '@playwright/test';
  16  | 
  17  | // ── URL de base (injectée par playwright.config.ts) ──────────────────
  18  | const LOGIN_PATH = '/login';
  19  | 
  20  | // ── Helpers BDD ──────────────────────────────────────────────────────
  21  | 
  22  | /** Given : naviguer sur la page login */
  23  | async function givenUserIsOnLoginPage(page: Page) {
  24  |   await page.goto(LOGIN_PATH);
  25  |   // Attendre que le formulaire React soit monté
  26  |   await page.waitForSelector('form', { timeout: 10_000 });
  27  | }
  28  | 
  29  | /** Given : être en mode inscription */
  30  | async function givenUserIsInSignupMode(page: Page) {
  31  |   await givenUserIsOnLoginPage(page);
  32  |   await page.getByText("Pas de compte ? S'inscrire").click();
  33  |   await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
  34  | }
  35  | 
  36  | /** When : sélectionner un rôle dans le <select> */
  37  | async function whenUserSelectsRole(page: Page, role: string) {
  38  |   await page.getByLabel('Rôle').selectOption({ label: role });
  39  | }
  40  | 
  41  | /** When : saisir dans un champ de formulaire */
  42  | async function whenUserTypesInField(page: Page, selector: string, value: string) {
  43  |   const field = page.locator(selector);
  44  |   await field.clear();
  45  |   await field.fill(value);
  46  | }
  47  | 
  48  | /** When : cliquer sur un bouton par son texte */
  49  | async function whenUserClicksButton(page: Page, label: string) {
  50  |   await page.getByRole('button', { name: label }).click();
  51  | }
  52  | 
  53  | // ── Feature : rendu & éléments de la page ────────────────────────────
  54  | test.describe('Feature: Page de connexion – Rendu initial', () => {
  55  | 
  56  |   /**
  57  |    * Scenario 1 : La page affiche tous les éléments requis
  58  |    * Given / When / Then
  59  |    */
  60  |   test('Scenario 1 – Tous les éléments de la page de connexion sont visibles', async ({ page }) => {
  61  |     // GIVEN l'utilisateur est sur la page "/login"
  62  |     await givenUserIsOnLoginPage(page);
  63  | 
  64  |     // WHEN la page est complètement chargée (implicite : waitForSelector ci-dessus)
  65  | 
  66  |     // THEN tous les éléments clés sont visibles
  67  |     await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  68  |     await expect(page.getByLabel('Rôle')).toBeVisible();
  69  |     await expect(page.getByLabel('Adresse email')).toBeVisible();
  70  |     await expect(page.getByPlaceholder('Minimum 6 caractères')).toBeVisible();
  71  |     await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
  72  |     await expect(page.getByText('Mot de passe oublié ?')).toBeVisible();
  73  |     await expect(page.getByText("Pas de compte ? S'inscrire")).toBeVisible();
  74  |   });
  75  | 
  76  | });
  77  | 
  78  | // ── Feature : validation du formulaire ───────────────────────────────
  79  | test.describe('Feature: Validation du formulaire de connexion', () => {
  80  | 
  81  |   /**
  82  |    * Scenario 2 : Soumission vide → messages d'erreur
  83  |    */
  84  |   test('Scenario 2 – Formulaire vide affiche les erreurs de validation', async ({ page }) => {
  85  |     // GIVEN le formulaire de connexion est vide
  86  |     await givenUserIsOnLoginPage(page);
  87  | 
  88  |     // WHEN l'utilisateur clique sur "Se connecter" sans rien remplir
  89  |     await whenUserClicksButton(page, 'Se connecter');
  90  | 
  91  |     // THEN les messages d'erreur Zod apparaissent
  92  |     await expect(page.getByText('Email requis')).toBeVisible();
  93  |     await expect(page.getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();
  94  | 
  95  |     // AND l'utilisateur reste sur /login
  96  |     expect(page.url()).toContain(LOGIN_PATH);
  97  |   });
  98  | 
  99  |   /**
  100 |    * Scenario 3 : Email invalide → erreur de format
  101 |    */
  102 |   test('Scenario 3 – Email au format invalide est rejeté', async ({ page }) => {
  103 |     // GIVEN
  104 |     await givenUserIsOnLoginPage(page);
  105 |     await whenUserSelectsRole(page, 'Étudiant');
  106 | 
  107 |     // WHEN l'utilisateur saisit un email malformé
  108 |     await whenUserTypesInField(page, 'input[type="email"]', 'email-invalide');
  109 |     await whenUserTypesInField(page, 'input[placeholder="Minimum 6 caractères"]', 'motdepasse123');
  110 |     await whenUserClicksButton(page, 'Se connecter');
  111 | 
  112 |     // THEN l'erreur de format apparaît
> 113 |     await expect(page.getByText('Adresse email invalide')).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
  114 |     expect(page.url()).toContain(LOGIN_PATH);
  115 |   });
  116 | 
  117 |   /**
  118 |    * Scenario 4 : Mot de passe trop court
  119 |    */
  120 |   test('Scenario 4 – Mot de passe de moins de 6 caractères est rejeté', async ({ page }) => {
  121 |     // GIVEN
  122 |     await givenUserIsOnLoginPage(page);
  123 |     await whenUserSelectsRole(page, 'Étudiant');
  124 | 
  125 |     // WHEN
  126 |     await whenUserTypesInField(page, 'input[type="email"]', 'ahmed@fstsbz.u-kairouan.tn');
  127 |     await whenUserTypesInField(page, 'input[placeholder="Minimum 6 caractères"]', 'abc');
  128 |     await whenUserClicksButton(page, 'Se connecter');
  129 | 
  130 |     // THEN
  131 |     await expect(page.getByText('Le mot de passe doit contenir au moins 6 caractères')).toBeVisible();
  132 |   });
  133 | 
  134 | });
  135 | 
  136 | // ── Feature : sélection des rôles ────────────────────────────────────
  137 | test.describe('Feature: Sélection des rôles disponibles', () => {
  138 | 
  139 |   const roles = [
  140 |     'Étudiant',
  141 |     'Tuteur',
  142 |     'Coordinateur pédagogique',
  143 |     'Membre du Jury',
  144 |   ];
  145 | 
  146 |   for (const role of roles) {
  147 |     /**
  148 |      * Scenario 5 (Outline) : Chaque rôle peut être sélectionné
  149 |      */
  150 |     test(`Scenario 5 – Rôle "${role}" est sélectionnable`, async ({ page }) => {
  151 |       // GIVEN
  152 |       await givenUserIsOnLoginPage(page);
  153 | 
  154 |       // WHEN l'utilisateur sélectionne le rôle
  155 |       await whenUserSelectsRole(page, role);
  156 | 
  157 |       // THEN l'option est bien sélectionnée
  158 |       const select = page.getByLabel('Rôle');
  159 |       await expect(select).toHaveValue(
  160 |         role === 'Étudiant' ? 'etudiant'
  161 |         : role === 'Tuteur' ? 'tuteur'
  162 |         : role === 'Coordinateur pédagogique' ? 'coordinateur'
  163 |         : 'jury'
  164 |       );
  165 |     });
  166 |   }
  167 | 
  168 | });
  169 | 
  170 | // ── Feature : navigation entre les modes ─────────────────────────────
  171 | test.describe('Feature: Navigation dans la page de connexion', () => {
  172 | 
  173 |   /**
  174 |    * Scenario 6 : Bascule vers le formulaire d'inscription
  175 |    */
  176 |   test("Scenario 6 – Bascule vers le mode inscription", async ({ page }) => {
  177 |     // GIVEN l'utilisateur est en mode connexion
  178 |     await givenUserIsOnLoginPage(page);
  179 |     await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  180 | 
  181 |     // WHEN il clique sur le lien d'inscription
  182 |     await page.getByText("Pas de compte ? S'inscrire").click();
  183 | 
  184 |     // THEN le titre change et le bouton s'adapte
  185 |     await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
  186 |     await expect(page.getByRole('button', { name: "S'inscrire" })).toBeVisible();
  187 |     // AND "Mot de passe oublié ?" disparaît en mode inscription
  188 |     await expect(page.getByText('Mot de passe oublié ?')).not.toBeVisible();
  189 |   });
  190 | 
  191 |   /**
  192 |    * Scenario 7 : Accès à la réinitialisation du mot de passe (SCRUM-14)
  193 |    */
  194 |   test('Scenario 7 – Accès au formulaire de réinitialisation du mot de passe (SCRUM-14)', async ({ page }) => {
  195 |     // GIVEN l'utilisateur est sur la page de connexion
  196 |     await givenUserIsOnLoginPage(page);
  197 | 
  198 |     // WHEN il clique sur "Mot de passe oublié ?"
  199 |     await page.getByText('Mot de passe oublié ?').click();
  200 | 
  201 |     // THEN la vue de réinitialisation s'affiche
  202 |     await expect(page.getByRole('heading', { name: 'Mot de passe oublié' })).toBeVisible();
  203 |     await expect(page.getByPlaceholder('votre@email.com')).toBeVisible();
  204 |     await expect(page.getByRole('button', { name: 'Envoyer le lien de réinitialisation' })).toBeVisible();
  205 |   });
  206 | 
  207 |   /**
  208 |    * Scenario 8 : Retour depuis la réinitialisation vers la connexion
  209 |    */
  210 |   test('Scenario 8 – Retour depuis "Mot de passe oublié" vers la connexion', async ({ page }) => {
  211 |     // GIVEN l'utilisateur est sur la vue de réinitialisation
  212 |     await givenUserIsOnLoginPage(page);
  213 |     await page.getByText('Mot de passe oublié ?').click();
```