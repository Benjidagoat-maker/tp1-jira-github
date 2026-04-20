#!/usr/bin/env node
/**
 * create-sprints.mjs
 * ──────────────────────────────────────────────────────────────────────
 * Crée 4 sprints SCRUM dans Jira et assigne les User Stories (SCRUM-11 à
 * SCRUM-49) en suivant les 6 Épics du backlog.
 *
 * Pré-requis :
 *   1. Avoir le Board ID de votre projet Jira
 *      → Allez sur https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM/boards
 *        L'URL contient ?boardId=X — copiez ce numéro.
 *   2. Créer un API Token sur https://id.atlassian.com/manage-profile/security/api-tokens
 *
 * Usage :
 *   JIRA_EMAIL=votre@email.com \
 *   JIRA_TOKEN=votre-api-token \
 *   JIRA_BOARD_ID=1 \
 *   node scripts/create-sprints.mjs
 * ──────────────────────────────────────────────────────────────────────
 */

const BASE_URL  = 'https://benji-d-goat1998.atlassian.net';
const EMAIL     = process.env.JIRA_EMAIL;
const TOKEN     = process.env.JIRA_TOKEN;
const BOARD_ID  = process.env.JIRA_BOARD_ID;

if (!EMAIL || !TOKEN || !BOARD_ID) {
  console.error('❌  Variables manquantes : JIRA_EMAIL, JIRA_TOKEN, JIRA_BOARD_ID');
  process.exit(1);
}

const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');
const HEADERS = {
  'Authorization': `Basic ${AUTH}`,
  'Content-Type':  'application/json',
  'Accept':        'application/json',
};

// ── Plan des 4 sprints ──────────────────────────────────────────────
const SPRINTS = [
  {
    name:      'Sprint 1 – Authentification & Accès',
    goal:      'Mettre en place la gestion des comptes et l\'authentification par rôle (EPIC 1)',
    startDate: '2025-10-01T09:00:00.000Z',
    endDate:   '2025-10-28T18:00:00.000Z',
    // US11→US18 + US23 (SCRUM-11..20) : gestion comptes étudiants, tuteurs, coordinateur, jury
    issues: ['SCRUM-11','SCRUM-12','SCRUM-13','SCRUM-14','SCRUM-15','SCRUM-16','SCRUM-17','SCRUM-18','SCRUM-19','SCRUM-20'],
  },
  {
    name:      'Sprint 2 – Propositions & Attribution',
    goal:      'Permettre la soumission de projets et l\'attribution des tuteurs (EPIC 2 + EPIC 3)',
    startDate: '2025-10-29T09:00:00.000Z',
    endDate:   '2025-11-25T18:00:00.000Z',
    // US24→US38 (SCRUM-21..31) : propositions, validation, attribution tuteurs
    issues: ['SCRUM-21','SCRUM-22','SCRUM-23','SCRUM-24','SCRUM-25','SCRUM-26','SCRUM-27','SCRUM-28','SCRUM-29','SCRUM-30','SCRUM-31'],
  },
  {
    name:      'Sprint 3 – Suivi & Compte-rendus',
    goal:      'Mettre en place le suivi d\'avancement et le dépôt des comptes-rendus (EPIC 4)',
    startDate: '2025-11-26T09:00:00.000Z',
    endDate:   '2025-12-23T18:00:00.000Z',
    // US39→US44 (SCRUM-32..40) : compte-rendus, validation tuteur, notifications
    issues: ['SCRUM-32','SCRUM-33','SCRUM-34','SCRUM-35','SCRUM-36','SCRUM-37','SCRUM-38','SCRUM-39','SCRUM-40'],
  },
  {
    name:      'Sprint 4 – Soutenance & Archivage',
    goal:      'Gérer la soutenance finale, les notes et l\'archivage (EPIC 5 + EPIC 6)',
    startDate: '2026-01-07T09:00:00.000Z',
    endDate:   '2026-02-03T18:00:00.000Z',
    // US45→US49 + archivage (SCRUM-41..49) : planning soutenance, grading, archivage
    issues: ['SCRUM-41','SCRUM-42','SCRUM-43','SCRUM-44','SCRUM-45','SCRUM-46','SCRUM-47','SCRUM-48','SCRUM-49'],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────
async function jiraFetch(path, method = 'GET', body = null) {
  const opts = { method, headers: HEADERS };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Jira API ${method} ${path} → ${res.status}: ${txt}`);
  }
  return res.json();
}

async function createSprint(sprint) {
  return jiraFetch('/rest/agile/1.0/sprint', 'POST', {
    name:           sprint.name,
    goal:           sprint.goal,
    startDate:      sprint.startDate,
    endDate:        sprint.endDate,
    originBoardId:  Number(BOARD_ID),
  });
}

async function moveTasks(sprintId, issues) {
  if (!issues.length) return;
  return jiraFetch(`/rest/agile/1.0/sprint/${sprintId}/issue`, 'POST', {
    issues,
  });
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀  Création des sprints sur le board #${BOARD_ID}\n`);

  for (const sprint of SPRINTS) {
    process.stdout.write(`  📅  Création "${sprint.name}" … `);
    try {
      const created = await createSprint(sprint);
      const sprintId = created.id;
      console.log(`✅  ID=${sprintId}`);

      process.stdout.write(`     📦  Assignation de ${sprint.issues.length} issues … `);
      await moveTasks(sprintId, sprint.issues);
      console.log('✅');

      // Démarrer le sprint 1 immédiatement (optionnel)
      if (sprint.name.startsWith('Sprint 1')) {
        await jiraFetch(`/rest/agile/1.0/sprint/${sprintId}`, 'POST', {
          state: 'active',
        }).catch(() => null); // ignore si déjà actif ou droits insuffisants
      }
    } catch (err) {
      console.log(`❌  ${err.message}`);
    }
  }

  console.log('\n✨  Done! Vérifiez votre board :');
  console.log(`    https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM/boards\n`);
}

main();
