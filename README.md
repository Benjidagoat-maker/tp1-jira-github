# Plateforme PF – FST-SBZ

> Projet Fédéré SI2 · Université de Kairouan · 2025–2026

[![Jira](https://img.shields.io/badge/Jira-SCRUM-blue?logo=jira)](https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase)](https://firebase.google.com)

---

## 📖 À propos du projet

Cette plateforme est conçue pour la gestion complète des **Projets de Fin d'Études (PFE)** pour les étudiants en SI2 à la FST de Sidi Bouzid. Elle permet de suivre tout le cycle de vie d'un projet, de la proposition initiale jusqu'à la soutenance finale.

L'application est intégrée avec **Jira** pour la gestion de projet et **GitHub** pour le contrôle de version, assurant une synchronisation parfaite entre les tickets et le code.

---

## 🌐 Application en ligne

Accédez à la plateforme directement depuis votre navigateur :
👉 **[https://pfe-fstsbz2025-2026.web.app](https://pfe-fstsbz2025-2026.web.app)**

---

## 🛠 Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | TailwindCSS 3 |
| **Routing** | React Router v6 |
| **State Management** | Zustand (avec persistance) |
| **Backend / Auth** | Firebase (Auth & Firestore) |
| **Déploiement** | Firebase Hosting |

---

## 📂 Structure du Projet

```
src/
├── components/
│   ├── Layout.tsx          # Structure globale (Navbar + Sidebar)
│   ├── ProtectedRoute.tsx  # Gestion des accès authentifiés
│   └── ui/                 # Composants UI réutilisables
├── pages/
│   ├── Home.tsx            # Landing page interactive
│   ├── Login.tsx           # Connexion multi-rôles
│   ├── Dashboard.tsx       # Tableau de bord personnalisé par rôle
│   ├── Groupe.tsx          # Gestion des équipes et infos projet
│   ├── Projets.tsx         # Catalogue et soumission de projets
│   ├── CompteRendus.tsx    # Dépôt et suivi des CR périodiques
│   └── Soutenance.tsx      # Gestion du rapport final et planning
├── store/
│   └── authStore.ts        # État global de l'authentification
└── types/
    └── index.ts            # Définitions TypeScript
```

---

## 👥 Rôles et Accès

Tous les utilisateurs doivent se connecter avec leur adresse institutionnelle `@fstsbz.u-kairouan.tn`.

| Rôle | Accès Principaux |
|------|------------------|
| **Étudiant** | Gestion de projet, Dépôt de CR, Rapport de soutenance |
| **Tuteur** | Suivi et validation des projets assignés |
| **Coordinateur** | Vue globale, validation des propositions, planning |
| **Jury** | Évaluation et planning des soutenances |

---

## 🚀 Développement et Déploiement

### Local
1. `npm install`
2. `npm run dev`

### Déploiement Firebase
Le déploiement est automatisé ou peut être lancé manuellement :
1. `npm run build`
2. `firebase deploy --only hosting`

---

## 📋 Gestion de Projet (Jira)

Nous utilisons une convention de commits stricte pour lier les modifications aux tickets Jira :
`SCRUM-XX : description de la modification`

- **Backlog** : [Accéder au tableau Jira](https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM)
- **Épics** : 6 Épics définis (SCRUM-5 → SCRUM-10)
- **User Stories** : 39 User Stories (SCRUM-11 → SCRUM-49)

---

*FST-SBZ · Université de Kairouan · SI2 2025–2026*
