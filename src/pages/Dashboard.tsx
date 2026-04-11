import { useAuthStore } from '../store/authStore';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FolderOpen, FileText, Award, CheckCircle2, Clock, AlertCircle,
  Users, TrendingUp, Calendar, BookOpen, BarChart3, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// ── Étudiant Dashboard ───────────────────────────────────────────────
function EtudiantDashboard() {
  const items = [
    { label: 'Mon projet', value: 'Plateforme PF FST-SBZ', sub: 'En cours', icon: FolderOpen, badge: 'success' as const },
    { label: 'Compte-rendus', value: '2 / 4', sub: 'Soumis', icon: FileText, badge: 'warning' as const },
    { label: 'Soutenance', value: '15 Juin 2026', sub: 'Salle A-12, 10h00', icon: Award, badge: 'info' as const },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.label}>
            <div className="flex items-start justify-between mb-3">
              <item.icon className="w-5 h-5 text-slate-400" />
              <Badge variant={item.badge}>{item.sub}</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className="font-display font-semibold text-slate-100">{item.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Progression globale</CardTitle></CardHeader>
        <div className="space-y-3">
          {[
            { label: 'Soumission du projet', done: true },
            { label: 'Compte-rendu #1', done: true },
            { label: 'Compte-rendu #2', done: true },
            { label: 'Compte-rendu #3', done: false },
            { label: 'Rapport final', done: false },
            { label: 'Soutenance', done: false },
          ].map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              {step.done
                ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                : <Clock className="w-4 h-4 text-slate-600 shrink-0" />}
              <span className={`text-sm ${step.done ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex gap-3">
<Link to="/projets"><Button variant="ghost" size="sm">Voir mes projets <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
        <Link to="/compte-rendus"><Button variant="ghost" size="sm">Compte-rendus <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
      </div>
    </div>
  );
}

// ── Tuteur Dashboard ─────────────────────────────────────────────────
function TuteurDashboard() {
  const projects = [
    { title: 'Plateforme PF FST-SBZ', student: 'Ahmed Ben Salah', status: 'En cours', pending: true },
    { title: 'Système de gestion RH', student: 'Fatma Mejri', status: 'Validé', pending: false },
    { title: 'App mobile étudiants', student: 'Mohamed Khalil', status: 'En attente', pending: true },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-400">Projets assignés</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">3</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-slate-400">En attente de validation</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">2</p>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Projets encadrés</CardTitle></CardHeader>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.title} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
              <div>
                <p className="text-sm font-medium text-slate-100">{p.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{p.student}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.pending && <Badge variant="warning">À valider</Badge>}
                <Badge variant={p.status === 'En cours' ? 'default' : p.status === 'Validé' ? 'success' : 'muted'}>
                  {p.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Coordinateur Dashboard ───────────────────────────────────────────
const pipeline = [
  { stage: 'Proposé', count: 5, color: 'text-slate-400', bg: 'bg-slate-700/50', projects: ['App IoT', 'Chatbot RH', 'ERP PME', 'Portail web', 'BI Dashboard'] },
  { stage: 'Validé', count: 8, color: 'text-blue-400', bg: 'bg-blue-600/10', projects: ['Plateforme PF', 'Syst. RH', 'App mobile', 'API REST', 'CI/CD pipeline', 'E-learning', 'Gestion stock', 'Auth service'] },
  { stage: 'En cours', count: 6, color: 'text-amber-400', bg: 'bg-amber-500/10', projects: ['Microservices', 'ML Model', 'DevOps', 'CRM web', 'Blockchain', 'NLP app'] },
  { stage: 'Soutenu', count: 3, color: 'text-green-400', bg: 'bg-green-500/10', projects: ['Projet A', 'Projet B', 'Projet C'] },
];

function CoordinateurDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3">
        {pipeline.map((s) => (
          <Card key={s.stage} className="text-center">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-400 mt-1">{s.stage}</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Pipeline des projets</CardTitle></CardHeader>
        <div className="grid grid-cols-4 gap-3">
          {pipeline.map((s) => (
            <div key={s.stage} className={`rounded-lg p-3 ${s.bg} border border-white/5`}>
              <p className={`text-xs font-semibold mb-2 ${s.color} font-mono uppercase tracking-wide`}>{s.stage}</p>
              <div className="space-y-1.5">
                {s.projects.map((p) => (
                  <div key={p} className="text-xs text-slate-300 bg-slate-800/60 rounded px-2 py-1 truncate">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2"><Users className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Étudiants actifs</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">24</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><BookOpen className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Tuteurs</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">8</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><BarChart3 className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Taux validation</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">76%</p>
        </Card>
      </div>
    </div>
  );
}

// ── Jury Dashboard ───────────────────────────────────────────────────
function JuryDashboard() {
  const soutenances = [
    { title: 'Plateforme PF FST-SBZ', student: 'Ahmed Ben Salah', date: '15 Juin 2026', time: '10h00', room: 'A-12', evaluated: false },
    { title: 'Système de gestion RH', student: 'Fatma Mejri', date: '15 Juin 2026', time: '14h00', room: 'B-5', evaluated: false },
    { title: 'App mobile étudiants', student: 'Mohamed Khalil', date: '16 Juin 2026', time: '09h30', room: 'A-12', evaluated: true },
  ];
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-blue-400" /><p className="text-sm text-slate-400">Soutenances à venir</p></div>
          <p className="text-3xl font-display font-bold text-slate-100">2</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-green-400" /><p className="text-sm text-slate-400">Projets évalués</p></div>
          <p className="text-3xl font-display font-bold text-slate-100">1</p>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Planning des soutenances</CardTitle></CardHeader>
        <div className="space-y-3">
          {soutenances.map((s) => (
            <div key={s.title} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
              <div>
                <p className="text-sm font-medium text-slate-100">{s.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.student} · {s.date} à {s.time} · Salle {s.room}</p>
              </div>
              <Badge variant={s.evaluated ? 'success' : 'warning'}>
                {s.evaluated ? 'Évalué' : 'À évaluer'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
      <Link to="/soutenance">
        <Button variant="ghost" size="sm">Voir toutes les soutenances <ArrowRight className="w-3.5 h-3.5" /></Button>
      </Link>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────
export function Dashboard() {
  const user = useAuthStore((s) => s.user);

  const roleLabels: Record<string, string> = {
    etudiant: 'Étudiant',
    tuteur: 'Tuteur',
    coordinateur: 'Coordinateur pédagogique',
    jury: 'Membre du Jury',
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {roleLabels[user?.role ?? '']} · Plateforme PF FST-SBZ 2025–2026
        </p>
      </div>

      {user?.role === 'etudiant' && <EtudiantDashboard />}
      {user?.role === 'tuteur' && <TuteurDashboard />}
      {user?.role === 'coordinateur' && <CoordinateurDashboard />}
      {user?.role === 'jury' && <JuryDashboard />}
    </div>
  );
}
