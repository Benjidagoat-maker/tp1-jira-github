import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Github, ExternalLink, GitBranch, Layers } from 'lucide-react';

const teamMembers = [
  {
    id: '1',
    initials: 'AB',
    name: 'Ahmed Ben Salah',
    role: 'etudiant' as const,
    email: 'ahmed.bensalah@fstsbz.u-kairouan.tn',
    specialty: 'Full-Stack Developer',
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    id: '2',
    initials: 'ST',
    name: 'Dr. Sami Trabelsi',
    role: 'tuteur' as const,
    email: 'sami.trabelsi@fstsbz.u-kairouan.tn',
    specialty: 'Génie Logiciel',
    gradient: 'from-green-500 to-emerald-700',
  },
  {
    id: '3',
    initials: 'LM',
    name: 'Prof. Leila Mansouri',
    role: 'coordinateur' as const,
    email: 'leila.mansouri@fstsbz.u-kairouan.tn',
    specialty: 'Coordinateur SI2',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: '4',
    initials: 'KJ',
    name: 'Dr. Karim Jebali',
    role: 'jury' as const,
    email: 'karim.jebali@fstsbz.u-kairouan.tn',
    specialty: 'Systèmes Distribués',
    gradient: 'from-purple-500 to-violet-700',
  },
];

const roleVariant = {
  etudiant: 'default' as const,
  tuteur: 'success' as const,
  coordinateur: 'warning' as const,
  jury: 'info' as const,
};

const roleLabel = {
  etudiant: 'Étudiant',
  tuteur: 'Tuteur',
  coordinateur: 'Coordinateur',
  jury: 'Jury',
};

const projectInfo = {
  name: 'Plateforme PF – FST-SBZ',
  type: 'Académique',
  mode: 'Binôme',
  technologies: ['React 18', 'TypeScript', 'Vite', 'TailwindCSS', 'Zustand', 'Zod'],
  github: 'https://github.com/Benjidagoat-maker/tp1-jira-github',
  jira: 'https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM/list?jql=project%20%3D%20SCRUM%20ORDER%20BY%20created%20DESC',
  status: 'En cours',
  progress: 68,
  sprints: 4,
  storiesDone: 26,
  storiesTotal: 39,
};

export function Groupe() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Équipe</h1>
        <p className="text-sm text-slate-400 mt-1">Membres du projet fédéré SI2 – FST-SBZ</p>
      </div>

      {/* Team members */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Membres</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id} hover className="text-center">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-lg font-bold mx-auto mb-3`}>
                {member.initials}
              </div>
              <p className="font-display font-semibold text-slate-100 text-sm">{member.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-2">{member.specialty}</p>
              <Badge variant={roleVariant[member.role]}>{roleLabel[member.role]}</Badge>
              <p className="text-xs text-slate-600 mt-3 font-mono truncate">{member.email}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Project info */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Projet</h2>
        <Card>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Nom du projet</p>
                <p className="font-display font-bold text-slate-100 text-lg">{projectInfo.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <Badge variant="default">{projectInfo.type}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mode</p>
                  <Badge variant="muted">{projectInfo.mode}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Statut</p>
                  <Badge variant="success">{projectInfo.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sprints</p>
                  <Badge variant="info">{projectInfo.sprints} sprints</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {projectInfo.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-slate-700/60 rounded text-xs text-slate-300 font-mono border border-slate-600/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-slate-500">Avancement global</p>
                  <span className="text-sm font-bold text-blue-400">{projectInfo.progress}%</span>
                </div>
                <div className="h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                    style={{ width: `${projectInfo.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  {projectInfo.storiesDone} / {projectInfo.storiesTotal} user stories complétées
                </p>
              </div>

              {/* Links */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Liens</p>
                <a
                  href={projectInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/40 border border-slate-700/30 hover:border-slate-600/60 transition-colors group"
                >
                  <Github className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300 flex-1 truncate font-mono text-xs">tp1-jira-integration</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </a>
                <a
                  href={projectInfo.jira}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/40 border border-slate-700/30 hover:border-slate-600/60 transition-colors group"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300 flex-1 truncate font-mono text-xs">SCRUM · Jira</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </a>
              </div>

              {/* Epics summary */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Épics</p>
                <div className="space-y-1.5">
                  {[
                    { key: 'EPIC 1', label: 'Gestion des comptes', pct: 90 },
                    { key: 'EPIC 2', label: 'Propositions de projets', pct: 75 },
                    { key: 'EPIC 3', label: 'Attribution & encadrement', pct: 60 },
                    { key: 'EPIC 4', label: 'Suivi avancement', pct: 50 },
                    { key: 'EPIC 5', label: 'Soutenance & évaluation', pct: 30 },
                    { key: 'EPIC 6', label: 'Archivage & consultation', pct: 10 },
                  ].map((epic) => (
                    <div key={epic.key} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 w-14 shrink-0">{epic.key}</span>
                      <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500/70 rounded-full"
                          style={{ width: `${epic.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{epic.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Git info */}
      <section>
        <Card className="bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-semibold text-slate-300 text-sm">Convention de branches</h3>
          </div>
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60">
              <span className="text-green-400">main</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">Branche protégée — PR obligatoire</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-slate-800/60">
              <span className="text-blue-400">FrontEnd/SCRUM-XX-description</span>
              <span className="text-slate-500">→</span>
              <span className="text-slate-400">Branches de fonctionnalité</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
