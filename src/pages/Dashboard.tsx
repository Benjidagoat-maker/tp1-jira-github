import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  FolderOpen, FileText, Award, CheckCircle2, Clock, AlertCircle,
  Users, TrendingUp, Calendar, BookOpen, BarChart3, ArrowRight, Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Team {
  id: string;
  groupe: string;
  scrumMaster: string;
  developers: string[];
  teamName: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  submittedBy: string;
  tuteur?: string;
}

interface CompteRendu {
  id: string;
  projectId: string;
  status: string;
}

interface Soutenance {
  id: string;
  projectId: string;
  date: string;
  time: string;
  room: string;
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
        // Find user's team by checking if their name is in developers or scrumMaster
        const teamsSnapshot = await getDocs(collection(db, 'teams'));
        let userTeam: Team | null = null;
        
        teamsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const userName = user.name.toLowerCase();
          const scrumMaster = (data.scrumMaster || '').toLowerCase();
          const developers = (data.developers || []).map((d: string) => d.toLowerCase());
          
          if (scrumMaster.includes(userName) || userName.includes(scrumMaster.split(' ')[0]) ||
              developers.some((d: string) => d.includes(userName) || userName.includes(d.split(' ')[0]))) {
            userTeam = { id: docSnap.id, ...data } as Team;
          }
        });
        setTeam(userTeam);

        // Fetch user's project
        const projectsQuery = query(collection(db, 'projects'), where('submittedBy', '==', user.id));
        const projectsSnapshot = await getDocs(projectsQuery);
        if (!projectsSnapshot.empty) {
          const projectDoc = projectsSnapshot.docs[0];
          setProject({ id: projectDoc.id, ...projectDoc.data() } as Project);

          // Fetch compte-rendus for this project
          const crQuery = query(collection(db, 'compteRendus'), where('projectId', '==', projectDoc.id));
          const crSnapshot = await getDocs(crQuery);
          setCompteRendus(crSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as CompteRendu)));

          // Fetch soutenance
          const soutQuery = query(collection(db, 'soutenances'), where('projectId', '==', projectDoc.id));
          const soutSnapshot = await getDocs(soutQuery);
          if (!soutSnapshot.empty) {
            setSoutenance({ id: soutSnapshot.docs[0].id, ...soutSnapshot.docs[0].data() } as Soutenance);
          }
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

  const submittedCR = compteRendus.filter(cr => cr.status === 'valide').length;
  const totalCR = 4; // Expected compte-rendus

  const items = [
    { 
      label: 'Mon projet', 
      value: project?.title || 'Aucun projet', 
      sub: project?.status || 'Non soumis', 
      icon: FolderOpen, 
      badge: project ? 'success' as const : 'muted' as const 
    },
    { 
      label: 'Compte-rendus', 
      value: `${submittedCR} / ${totalCR}`, 
      sub: 'Soumis', 
      icon: FileText, 
      badge: submittedCR > 0 ? 'warning' as const : 'muted' as const 
    },
    { 
      label: 'Soutenance', 
      value: soutenance ? soutenance.date : 'Non planifiée', 
      sub: soutenance ? `Salle ${soutenance.room}, ${soutenance.time}` : '-', 
      icon: Award, 
      badge: soutenance ? 'info' as const : 'muted' as const 
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
      {/* Team Info */}
      {team && (
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-slate-400">Mon équipe</p>
          </div>
          <p className="font-display font-semibold text-slate-100 text-lg">
            {team.teamName || team.groupe}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Scrum Master: {team.scrumMaster} · {team.developers.length} membres
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
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        const projectsQuery = query(collection(db, 'projects'), where('tuteur', '==', user.id));
        const projectsSnapshot = await getDocs(projectsQuery);
        setProjects(projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      } catch (error) {
        console.error('Error fetching tuteur data:', error);
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

  const pendingCount = projects.filter(p => p.status === 'en_attente').length;

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
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
                <div>
                  <p className="text-sm font-medium text-slate-100">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.submittedBy}</p>
                </div>
                <Badge variant={p.status === 'en_cours' ? 'default' : p.status === 'valide' ? 'success' : 'warning'}>
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
  const [stats, setStats] = useState({ students: 0, tuteurs: 0, projects: { proposed: 0, validated: 0, inProgress: 0, completed: 0 } });
  const [projectsByStatus, setProjectsByStatus] = useState<Record<string, Project[]>>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        let students = 0, tuteurs = 0;
        usersSnapshot.forEach(d => {
          const role = d.data().role;
          if (role === 'etudiant') students++;
          if (role === 'tuteur') tuteurs++;
        });

        // Fetch all projects
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projects: Project[] = projectsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        
        const byStatus: Record<string, Project[]> = {
          'en_attente': [],
          'valide': [],
          'en_cours': [],
          'soutenu': [],
        };
        projects.forEach(p => {
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
          }
        });
        setProjectsByStatus(byStatus);
      } catch (error) {
        console.error('Error fetching coordinator data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const pipeline = [
    { stage: 'Proposé', count: stats.projects.proposed, color: 'text-slate-400', bg: 'bg-slate-700/50', projects: projectsByStatus['en_attente'] || [] },
    { stage: 'Validé', count: stats.projects.validated, color: 'text-blue-400', bg: 'bg-blue-600/10', projects: projectsByStatus['valide'] || [] },
    { stage: 'En cours', count: stats.projects.inProgress, color: 'text-amber-400', bg: 'bg-amber-500/10', projects: projectsByStatus['en_cours'] || [] },
    { stage: 'Soutenu', count: stats.projects.completed, color: 'text-green-400', bg: 'bg-green-500/10', projects: projectsByStatus['soutenu'] || [] },
  ];

  const totalProjects = pipeline.reduce((sum, s) => sum + s.count, 0);
  const validationRate = totalProjects > 0 ? Math.round(((stats.projects.validated + stats.projects.inProgress + stats.projects.completed) / totalProjects) * 100) : 0;

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
          <div className="flex items-center gap-3 mb-2"><Users className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Étudiants actifs</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">{stats.students}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><BookOpen className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Tuteurs</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">{stats.tuteurs}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><BarChart3 className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400">Taux validation</p></div>
          <p className="text-2xl font-display font-bold text-slate-100">{validationRate}%</p>
        </Card>
      </div>
    </div>
  );
}

// ── Jury Dashboard ───────────────────────────────────────────────────
function JuryDashboard() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [soutenances, setSoutenances] = useState<Array<Soutenance & { projectTitle: string; studentName: string; evaluated: boolean }>>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        const soutSnapshot = await getDocs(collection(db, 'soutenances'));
        const souts: Array<Soutenance & { projectTitle: string; studentName: string; evaluated: boolean }> = [];
        
        for (const docSnap of soutSnapshot.docs) {
          const data = docSnap.data();
          // Check if this jury member is assigned to this soutenance
          if (data.jury && data.jury.includes(user.id)) {
            const projectDoc = await getDoc(doc(db, 'projects', data.projectId));
            const projectData = projectDoc.data();
            souts.push({
              id: docSnap.id,
              ...data,
              projectTitle: projectData?.title || 'Unknown',
              studentName: projectData?.submittedBy || 'Unknown',
              evaluated: data.status === 'termine',
            } as Soutenance & { projectTitle: string; studentName: string; evaluated: boolean });
          }
        }
        setSoutenances(souts);
      } catch (error) {
        console.error('Error fetching jury data:', error);
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

  const upcoming = soutenances.filter(s => !s.evaluated).length;
  const evaluated = soutenances.filter(s => s.evaluated).length;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-blue-400" /><p className="text-sm text-slate-400">Soutenances à venir</p></div>
          <p className="text-3xl font-display font-bold text-slate-100">{upcoming}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-green-400" /><p className="text-sm text-slate-400">Projets évalués</p></div>
          <p className="text-3xl font-display font-bold text-slate-100">{evaluated}</p>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Planning des soutenances</CardTitle></CardHeader>
        <div className="space-y-3">
          {soutenances.length === 0 ? (
            <p className="text-sm text-slate-500">Aucune soutenance assignée</p>
          ) : (
            soutenances.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/30">
                <div>
                  <p className="text-sm font-medium text-slate-100">{s.projectTitle}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.studentName} · {s.date} à {s.time} · Salle {s.room}</p>
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
          Bonjour, {user?.name}
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
