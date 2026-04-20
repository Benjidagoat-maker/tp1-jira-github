# ──────────────────────────────────────────────────────────────────────
#  Feature : Authentification – Page de connexion
#  Inspiré du projet de référence pf2026/site_vente_en_ligne
#  (porté de Java/Cucumber → Node.js/Playwright)
#
#  US testées : SCRUM-11 (accès étudiant), SCRUM-18 (accès coordinateur),
#               SCRUM-14 (réinitialisation mot de passe)
# ──────────────────────────────────────────────────────────────────────
Feature: Authentification sur la plateforme PF-FST-SBZ
  En tant qu'utilisateur de la plateforme
  Je veux accéder à la page de connexion
  Afin de m'authentifier avec mon rôle institutionnel

  Background:
    Given l'utilisateur est sur la page "/login"
    And le titre de la page est "Plateforme PF – FST-SBZ"

  # ── Scénario 1 : rendu initial de la page ──────────────────────────
  @Acceptance @UI
  Scenario: La page de connexion affiche tous les éléments requis
    When la page est complètement chargée
    Then le titre "Connexion" est visible
    And le sélecteur de rôle est présent
    And le champ "Adresse email" est présent
    And le champ "Mot de passe" est présent
    And le bouton "Se connecter" est présent
    And le lien "Mot de passe oublié ?" est présent

  # ── Scénario 2 : validation – soumission formulaire vide ───────────
  @Acceptance @Validation
  Scenario: La soumission d'un formulaire vide affiche des messages d'erreur
    Given le formulaire de connexion est vide
    When l'utilisateur clique sur le bouton "Se connecter"
    Then le message d'erreur "Email requis" est affiché
    And le message d'erreur "Le mot de passe doit contenir au moins 6 caractères" est affiché
    And l'utilisateur reste sur la page "/login"

  # ── Scénario 3 : validation – format email invalide ────────────────
  @Acceptance @Validation
  Scenario: Un email au format invalide affiche une erreur de validation
    Given l'utilisateur sélectionne le rôle "Étudiant"
    And l'utilisateur saisit "email-invalide" dans le champ email
    And l'utilisateur saisit "motdepasse123" dans le champ mot de passe
    When l'utilisateur clique sur le bouton "Se connecter"
    Then le message d'erreur "Adresse email invalide" est affiché
    And l'utilisateur reste sur la page "/login"

  # ── Scénario 4 : validation – mot de passe trop court ─────────────
  @Acceptance @Validation
  Scenario: Un mot de passe de moins de 6 caractères est rejeté
    Given l'utilisateur sélectionne le rôle "Étudiant"
    And l'utilisateur saisit "ahmed@fstsbz.u-kairouan.tn" dans le champ email
    And l'utilisateur saisit "abc" dans le champ mot de passe
    When l'utilisateur clique sur le bouton "Se connecter"
    Then le message d'erreur "Le mot de passe doit contenir au moins 6 caractères" est affiché

  # ── Scénario 5 : sélection d'un rôle différent ────────────────────
  @Acceptance @UI
  Scenario Outline: L'utilisateur peut sélectionner chacun des 4 rôles disponibles
    Given l'utilisateur est sur la page "/login"
    When l'utilisateur sélectionne le rôle "<role>"
    Then l'option "<role>" est sélectionnée dans le sélecteur

    Examples:
      | role                       |
      | Étudiant                   |
      | Tuteur                     |
      | Coordinateur pédagogique   |
      | Membre du Jury             |

  # ── Scénario 6 : bascule vers le mode inscription ─────────────────
  @Acceptance @Navigation
  Scenario: L'utilisateur peut basculer vers le formulaire d'inscription
    Given l'utilisateur est sur la page "/login" en mode connexion
    When l'utilisateur clique sur le lien "Pas de compte ? S'inscrire"
    Then le titre "Créer un compte" est visible
    And le bouton "S'inscrire" est présent
    And l'indicateur de force du mot de passe est absent

  # ── Scénario 7 : indicateur de force du mot de passe (inscription) ─
  @Acceptance @UI
  Scenario: L'indicateur de force s'affiche lors de la saisie du mot de passe en inscription
    Given l'utilisateur est en mode inscription
    When l'utilisateur saisit "abc" dans le champ mot de passe
    Then l'indicateur de force affiche "You need a stronger password."
    When l'utilisateur saisit "MonMotDePasse123!" dans le champ mot de passe
    Then l'indicateur de force affiche "Mot de passe fort !"

  # ── Scénario 8 : accès à la réinitialisation du mot de passe ──────
  @Acceptance @Navigation
  Scenario: L'utilisateur peut accéder au formulaire de réinitialisation (SCRUM-14)
    Given l'utilisateur est sur la page "/login" en mode connexion
    When l'utilisateur clique sur le lien "Mot de passe oublié ?"
    Then le titre "Mot de passe oublié" est visible
    And le champ email de réinitialisation est présent
    And le bouton "Envoyer le lien de réinitialisation" est présent

  # ── Scénario 9 : retour depuis la réinitialisation ────────────────
  @Acceptance @Navigation
  Scenario: L'utilisateur peut revenir à la connexion depuis la réinitialisation
    Given l'utilisateur est sur la vue "Mot de passe oublié"
    When l'utilisateur clique sur le lien "Retour à la connexion"
    Then le titre "Connexion" est visible
    And le champ "Mot de passe" est présent

  # ── Scénario 10 : visibilité du mot de passe ──────────────────────
  @Acceptance @UI
  Scenario: L'utilisateur peut afficher et masquer son mot de passe
    Given l'utilisateur a saisi "secret123" dans le champ mot de passe
    When l'utilisateur clique sur l'icône de visibilité du mot de passe
    Then le champ mot de passe est de type "text"
    When l'utilisateur clique à nouveau sur l'icône de visibilité
    Then le champ mot de passe est de type "password"
