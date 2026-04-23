import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FolderOpen, FileText, Award, CheckCircle2, Clock, AlertCircle,
  Users, TrendingUp, Calendar, BookOpen, BarChart3, ArrowRight, Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

interface Team {
  id: string;
  groupe: string;
  scrum_master: string;
  dev1: string | null;
  dev2: string | null;
  dev3: string | null;
  dev4: string | null;
  dev5: string | null;
  team_name: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  submitted_by: string;
  tuteur?: string;
}

interface CompteRendu {
  id: string;
  project_id: string;
  status: string;
}

interface Soutenance {
  id: string;
  project_id: string;
  date: string;
  time: string;
  room: string;
  status: string;
}

// ── Étudiant Dashboard ───────────────────────────────────────────────
function EtudiantDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<Team | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [compteRendus, setCompteRendus] = useState<CompteRendu[]>([]);
  const [soutenance, setSoutenance] = useState<Soutenance | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        // Find user's team
        const { data: teams } = await supabase.from('teams').select('*');
        if (teams) {
          const userName = user.name.toLowerCase();
          const found = teams.find((t: Team) => {
            const members = [t.scrum_master, t.dev1, t.dev2, t.dev3, t.dev4, t.dev5]
              .filter(Boolean)
              .map((m) => (m as string).toLowerCase());
            return members.some(
              (m) => m.includes(userName.split(' ')[0]) || userName.includes(m.split(' ')[0])
            );
          });
          setTeam(found ?? null);
        }

        // Fetch user's project
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('submitted_by', user.name)
          .limit(1);

        if (projects && projects.length > 0) {
          const p = projects[0];
          setProject(p);

          // Fetch compte-rendus
          const { data: crs } = await supabase
            .from('compte_rendus')
            .select('*')
            .eq('project_id', p.id);
          setCompteRendus(crs ?? []);

          // Fetch soutenance
          const { data: souts } = await supabase
            .from('soutenances')
            .select('*')
            .eq('project_id', p.id)
            .limit(1);
          setSoutenance(souts?.[0] ?? null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const submittedCR = compteRendus.filter((cr) => cr.status === 'valide').length;
  const totalCR = 4;

  const items = [
    {
      label: 'Mon projet',
      value: project?.title || 'Aucun projet',
      sub: project?.status || 'Non soumis',
      icon: FolderOpen,
      badge: project ? ('success' as const) : ('muted' as const),
    },
    {
      label: 'Compte-rendus',
      value: `${submittedCR} / ${totalCR}`,
      sub: 'Soumis',
      icon: FileText,
      badge: submittedCR > 0 ? ('warning' as const) : ('muted' as const),
    },
    {
      label: 'Soutenance',
      value: soutenance ? soutenance.date : 'Non planifiée',
      sub: soutenance ? `Salle ${soutenance.room}, ${soutenance.time}` : '-',
      icon: Award,
      badge: soutenance ? ('info' as const) : ('muted' as const),
    },
  ];

  const progressSteps = [
    { label: 'Soumission du projet', done: !!project },
    { label: 'Compte-rendu #1', done: compteRendus.length >= 1 },
    { label: 'Compte-rendu #2', done: compteRendus.length >= 2 },
    { label: 'Compte-rendu #3', done: compteRendus.length >= 3 },
    { label: 'Rapport final', done: compteRendus.length >= 4 },
    { label: 'Soutenance', done: false },
  ];

  return (
    <div className="space-y-6">
      {team && (
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-400">Mon équipe</p>
          </div>
          <p className="font-display font-semibold text-slate-100 text-lg">
            {team.team_name || team.groupe}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Scrum Master: {team.scrum_master} · Groupe {team.groupe}
          </p>
        </Card>
      )}

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
          {progressSteps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              {step.done
                ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                : <Clock className="w-4 h-4 text-slate-600 shrink-0" />}
              <span className={`text-sm ${step.done ? 'text-slate-300' : 'text-slate-500'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <Link to="/projets">
          <Button variant="ghost" size="sm">Voir mes projets <ArrowRight className="w-3.5 h-3.5" /></Button>
        </Link>
        <Link to="/compte-rendus">
          <Button variant="ghost" size="sm">Compte-rendus <ArrowRight className="w-3.5 h-3.5" /></Button>
        </Link>
      </div>
    </div>
  );
}

// ── Tuteur Dashboard ─────────────────────────────────────────────────
function TuteurDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('tuteur', user.name);
      setProjects(data ?? []);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  const pendingCount = projects.filter((p) => p.status === 'en_attente').length;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-400">Projets assignés</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">{projects.length}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-slate-400">En attente de validation</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">{pendingCount}</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Projets encadrés</CardTitle></CardHeader>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun projet assigné</p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30"
              >
                <div>
                  <p className="text-sm font-medium text-slate-100">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.submitted_by}</p>
                </div>
                <Badge
                  variant={
                    p.status === 'en_cours' ? 'default' : p.status === 'valide' ? 'success' : 'warning'
                  }
                >
                  {p.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

// ── Coordinateur Dashboard ───────────────────────────────────────────
function CoordinateurDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    tuteurs: 0,
    projects: { proposed: 0, validated: 0, inProgress: 0, completed: 0 },
  });
  const [projectsByStatus, setProjectsByStatus] = useState<Record<string, Project[]>>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch profiles
      const { data: profiles } = await supabase.from('profiles').select('role');
      let students = 0, tuteurs = 0;
      (profiles ?? []).forEach((p: { role: string }) => {
        if (p.role === 'etudiant') students++;
        if (p.role === 'tuteur') tuteurs++;
      });

      // Fetch projects
      const { data: projects } = await supabase.from('projects').select('*');
      const byStatus: Record<string, Project[]> = {
        en_attente: [], valide: [], en_cours: [], soutenu: [],
      };
      (projects ?? []).forEach((p: Project) => {
        if (byStatus[p.status]) byStatus[p.status].push(p);
      });

      setStats({
        students,
        tuteurs,
        projects: {
          proposed: byStatus['en_attente'].length,
          validated: byStatus['valide'].length,
          inProgress: byStatus['en_cours'].length,
          completed: byStatus['soutenu'].length,
        },
      });
      setProjectsByStatus(byStatus);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  const pipeline = [
    { stage: 'Proposé',   count: stats.projects.proposed,   color: 'text-slate-400',  bg: 'bg-slate-700/50',   projects: projectsByStatus['en_attente'] ?? [] },
    { stage: 'Validé',    count: stats.projects.validated,  color: 'text-blue-400',   bg: 'bg-blue-600/10',    projects: projectsByStatus['valide'] ?? [] },
    { stage: 'En cours',  count: stats.projects.inProgress, color: 'text-amber-400',  bg: 'bg-amber-500/10',   projects: projectsByStatus['en_cours'] ?? [] },
    { stage: 'Soutenu',   count: stats.projects.completed,  color: 'text-green-400',  bg: 'bg-green-500/10',   projects: projectsByStatus['soutenu'] ?? [] },
  ];

  const totalProjects = pipeline.reduce((sum, s) => sum + s.count, 0);
  const validationRate =
    totalProjects > 0
      ? Math.round(
          ((stats.projects.validated + stats.projects.inProgress + stats.projects.completed) /
            totalProjects) *
            100
        )
      : 0;

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
              <p className={`text-xs font-semibold mb-2 ${s.color} font-mono uppercase tracking-wide`}>
                {s.stage}
              </p>
              <div className="space-y-1.5">
                {s.projects.length === 0 ? (
                  <div className="text-xs text-slate-500">Aucun projet</div>
                ) : (
                  s.projects.slice(0, 5).map((p) => (
                    <div key={p.id} className="text-xs text-slate-300 bg-slate-800/60 rounded px-2 py-1 truncate">
                      {p.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-400">Étudiants actifs</p>
          </div>
          <p className="text-2xl font-display font-bold text-slate-100">{stats.students}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-400">Tuteurs</p>
          </div>
          <p className="text-2xl font-display font-bold text-slate-100">{stats.tuteurs}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-400">Taux validation</p>
          </div>
          <p className="text-2xl font-display font-bold text-slate-100">{validationRate}%</p>
        </Card>
      </div>
    </div>
  );
}

// ── Jury Dashboard ───────────────────────────────────────────────────
function JuryDashboard() {
  const [loading, setLoading] = useState(true);
  const [soutenances, setSoutenances] = useState<
    Array<{ id: string; project_title: string; student_name: string; date: string; time: string; room: string; evaluated: boolean }>
  >([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await supabase
        .from('soutenances')
        .select('*, projects(title, submitted_by)');

      setSoutenances(
        (data ?? []).map((s: any) => ({
          id: s.id,
          project_title: s.projects?.title ?? 'Unknown',
          student_name: s.projects?.submitted_by ?? 'Unknown',
          date: s.date,
          time: s.time,
          room: s.room,
          evaluated: s.status === 'termine',
        }))
      );
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-400">Soutenances à venir</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">
            {soutenances.filter((s) => !s.evaluated).length}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <p className="text-sm text-slate-400">Projets évalués</p>
          </div>
          <p className="text-3xl font-display font-bold text-slate-100">
            {soutenances.filter((s) => s.evaluated).length}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Planning des soutenances</CardTitle></CardHeader>
        <div className="space-y-3">
          {soutenances.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune soutenance assignée</p>
          ) : (
            soutenances.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30"
              >
                <div>
                  <p className="text-sm font-medium text-slate-100">{s.project_title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {s.student_name} · {s.date} à {s.time} · Salle {s.room}
                  </p>
                </div>
                <Badge variant={s.evaluated ? 'success' : 'warning'}>
                  {s.evaluated ? 'Évalué' : 'À évaluer'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      <Link to="/soutenance">
        <Button variant="ghost" size="sm">
          Voir toutes les soutenances <ArrowRight className="w-3.5 h-3.5" />
        </Button>
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
          Bonjour, {user?.name}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {roleLabels[user?.role ?? '']} · Plateforme PF FST-SBZ 2025–2026
        </p>
      </div>

      {user?.role === 'etudiant'     && <EtudiantDashboard />}
      {user?.role === 'tuteur'       && <TuteurDashboard />}
      {user?.role === 'coordinateur' && <CoordinateurDashboard />}
      {user?.role === 'jury'         && <JuryDashboard />}
    </div>
  );
}
