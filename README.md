# Plateforme PF – FST-SBZ

> Projet Fédéré SI2 · Université de Kairouan · 2025–2026

[![Jira](https://img.shields.io/badge/Jira-SCRUM-blue?logo=jira)](https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | TailwindCSS 3 |
| Routing | React Router v6 |
| State | Zustand (persisté) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Installation

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```
## Lancement
```bash
cd C:\Users\kenji\tp1-jira-integration or C:\Users\kenji\OneDrive\Documents\GitHub\Tp1
npm run dev
```


## Structure du projet

```
src/
├── components/
│   ├── Layout.tsx          # Navbar + sidebar
│   ├── ProtectedRoute.tsx  # Garde d'authentification
│   └── ui/                 # Composants réutilisables
├── pages/
│   ├── Home.tsx            # Landing page (SCRUM-1)
│   ├── Login.tsx           # Connexion avec sélecteur de rôle (SCRUM-3)
│   ├── Dashboard.tsx       # Dashboard par rôle
│   ├── Groupe.tsx          # Équipe & infos projet (SCRUM-2)
│   ├── Projets.tsx         # Propositions de projets (SCRUM-5→9)
│   ├── CompteRendus.tsx    # Compte-rendus périodiques (SCRUM-11→12)
│   └── Soutenance.tsx      # Rapport final & soutenance (SCRUM-13→14)
├── store/
│   └── authStore.ts        # Auth Zustand
└── types/
    └── index.ts            # Interfaces TypeScript
```

---

## Rôles disponibles

| Rôle | Email exemple | Accès |
|------|--------------|-------|
| Étudiant | ahmed.bensalah@fstsbz.u-kairouan.tn | Projet, CR, Soutenance |
| Tuteur | sami.trabelsi@fstsbz.u-kairouan.tn | Projets assignés |
| Coordinateur | leila.mansouri@fstsbz.u-kairouan.tn | Pipeline global |
| Jury | karim.jebali@fstsbz.u-kairouan.tn | Planning soutenances |

> Tous les emails doivent se terminer par `@fstsbz.u-kairouan.tn`

---

## Convention de commits (obligatoire pour sync Jira)

```
SCRUM-XX : description de la modification
```

Exemples :
- `SCRUM-1 : setup vite react typescript project`
- `SCRUM-3 : implement login page with role selector and zod validation`
- `SCRUM-5 : add project submission form`

---

## Stratégie de branches

- `main` — branche protégée (PR + 1 approbation requise)
- `FrontEnd/SCRUM-XX-description` — branches de fonctionnalité

---

## CI/CD — Auto-tagging

À chaque merge sur `main`, le workflow `.github/workflows/tag-version.yml` crée automatiquement un tag sémantique (`v0.0.1`, `v0.0.2`, etc.).

---

## Backlog Jira

- **6 Épics** (SCRUM-5 → SCRUM-10)
- **39 User Stories** (SCRUM-11 → SCRUM-49)
- Projet : [SCRUM sur Jira](https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM)

---

## Étapes manuelles requises

### Jira Automation (Project Settings → Automation)
1. **Trigger:** Branch created → **Action:** Transition issue → `In Progress`
2. **Trigger:** PR merged → **Action:** Transition → `Done` + commentaire : `"Développement terminé et mergé dans main."`

### GitHub Branch Protection (Settings → Branches → main)
- ✅ Require pull request before merging
- ✅ Require at least 1 approval
- ✅ Do not allow bypassing

---

*FST-SBZ · Université de Kairouan · SI2 2025–2026*
