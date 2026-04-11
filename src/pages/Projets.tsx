import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus, X, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp,
  Pencil, MessageSquare, UserCheck, RotateCcw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuthStore } from '../store/authStore';
import type { Project, ProjectStatus } from '../types';

/* ── Zod schemas ─────────────────────────────── */
const projectSchema = z.object({
  title:        z.string().min(5, 'Minimum 5 caractères'),
  description:  z.string().min(20, 'Minimum 20 caractères'),
  type:         z.enum(['academique', 'entreprise'], { required_error: 'Requis' }),
  mode:         z.enum(['solo', 'binome'],           { required_error: 'Requis' }),
  technologies: z.string().min(1, 'Au moins une technologie'),
});
type ProjectFormData = z.infer<typeof projectSchema>;

const feedbackSchema = z.object({
  comment: z.string().min(5, 'Commentaire requis'),
});
type FeedbackData = z.infer<typeof feedbackSchema>;

/* ── Mock data ──────────────────────────────── */
const initial: Project[] = [
  {
    id: '1', title: 'Plateforme PF FST-SBZ',
    description: "Application web complète pour la gestion des projets de fin d'études avec intégration Jira + GitHub.",
    type: 'academique', mode: 'solo',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    status: 'en_cours', submittedBy: 'Ahmed Ben Salah',
    tuteur: 'Dr. Sami Trabelsi', createdAt: '2025-10-01', jiraKey: 'SCRUM-5',
  },
  {
    id: '2', title: 'Système de gestion RH',
    description: 'Application de gestion des ressources humaines pour une PME tunisienne avec module de paie.',
    type: 'entreprise', mode: 'binome',
    technologies: ['Spring Boot', 'Angular', 'PostgreSQL'],
    status: 'en_attente', submittedBy: 'Fatma Mejri',
    createdAt: '2025-10-05', jiraKey: 'SCRUM-6',
  },
  {
    id: '3', title: 'App mobile étudiants',
    description: 'Application mobile pour la gestion des emplois du temps et des notes à la FST-SBZ.',
    type: 'academique', mode: 'binome',
    technologies: ['React Native', 'Expo', 'Firebase'],
    status: 'en_attente', submittedBy: 'Mohamed Khalil',
    createdAt: '2025-10-10', jiraKey: 'SCRUM-7',
  },
  {
    id: '4', title: 'Portail e-learning',
    description: 'Plateforme d\'apprentissage en ligne avec cours vidéo, quiz interactifs et suivi de progression.',
    type: 'academique', mode: 'solo',
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
    status: 'refuse', submittedBy: 'Sarra Boughanmi',
    createdAt: '2025-10-12', jiraKey: 'SCRUM-8',
    feedback: 'La portée est trop large pour un seul étudiant. Veuillez réduire le périmètre ou passer en binôme.',
  },
];

const TUTEURS = ['Dr. Sami Trabelsi', 'Prof. Leila Mansouri', 'Dr. Karim Jebali', 'Dr. Amira Rezgui'];

const statusCfg: Record<ProjectStatus, { label: string; variant: 'default'|'success'|'warning'|'danger'|'info'|'muted'; icon: typeof CheckCircle2 }> = {
  en_attente: { label: 'En attente', variant: 'warning', icon: Clock },
  valide:     { label: 'Validé',     variant: 'success', icon: CheckCircle2 },
  refuse:     { label: 'Refusé',     variant: 'danger',  icon: XCircle },
  en_cours:   { label: 'En cours',   variant: 'default', icon: Clock },
  soumis:     { label: 'Soumis',     variant: 'info',    icon: Clock },
  soutenu:    { label: 'Soutenu',    variant: 'success', icon: CheckCircle2 },
};

/* ── Sub-components ─────────────────────────── */

function EditForm({ project, onSave, onCancel }: {
  project: Project; onSave: (data: ProjectFormData) => void; onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title, description: project.description,
      type: project.type, mode: project.mode,
      technologies: project.technologies.join(', '),
    },
  });
  return (
    <form onSubmit={handleSubmit(onSave)} className="mt-4 pt-4 border-t border-[var(--border)] space-y-4">
      <p className="text-xs font-mono text-[var(--gold)] uppercase tracking-widest">Mode édition</p>
      <Input label="Titre" error={errors.title?.message} {...register('title')} />
      <div>
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
        <textarea rows={3} {...register('description')}
          className={`w-full rounded-xl px-4 py-3 text-sm border bg-[var(--bg-card)]
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:outline-none focus:ring-2 resize-none
            ${errors.description ? 'border-red-500/40 focus:ring-red-500/20' : 'border-[var(--border)] focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]'}`} />
        {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Select label="Type" options={[{value:'academique',label:'Académique'},{value:'entreprise',label:'Entreprise'}]}
          error={errors.type?.message} {...register('type')} />
        <Select label="Mode" options={[{value:'solo',label:'Solo'},{value:'binome',label:'Binôme'}]}
          error={errors.mode?.message} {...register('mode')} />
      </div>
      <Input label="Technologies (virgules)" error={errors.technologies?.message} {...register('technologies')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="gold" size="sm" loading={isSubmitting}>Enregistrer</Button>
      </div>
    </form>
  );
}

function TutorActions({ project, onValidate, onReject }: {
  project: Project;
  onValidate: (id: string) => void;
  onReject:   (id: string, comment: string) => void;
}) {
  const [mode, setMode] = useState<'idle'|'rejecting'>('idle');
  const { register, handleSubmit, formState: { errors } } = useForm<FeedbackData>({
    resolver: zodResolver(feedbackSchema),
  });
  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)]">
      {mode === 'idle' ? (
        <div className="flex items-center gap-3">
          <p className="text-xs text-[var(--text-muted)] mr-auto font-mono">Actions tuteur</p>
          <Button variant="teal" size="sm" onClick={() => onValidate(project.id)}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Valider
          </Button>
          <Button variant="danger" size="sm" onClick={() => setMode('rejecting')}>
            <XCircle className="w-3.5 h-3.5" /> Demander ajustements
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(d => onReject(project.id, d.comment))} className="space-y-3">
          <p className="text-xs font-mono text-red-400">Commentaire de refus</p>
          <textarea rows={3} placeholder="Expliquez les ajustements requis..."
            {...register('comment')}
            className={`w-full rounded-xl px-4 py-3 text-sm border bg-[var(--bg-card)]
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none focus:ring-2 resize-none
              ${errors.comment ? 'border-red-500/40 focus:ring-red-500/20' : 'border-[var(--border)] focus:border-red-400/40 focus:ring-red-400/15'}`} />
          {errors.comment && <p className="text-xs text-red-400">{errors.comment.message}</p>}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setMode('idle')}>Annuler</Button>
            <Button type="submit" variant="danger" size="sm">Envoyer le refus</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function CoordActions({ project, onAssign }: {
  project: Project; onAssign: (id: string, tuteur: string) => void;
}) {
  const [selected, setSelected] = useState(project.tuteur ?? '');
  return (
    <div className="mt-4 pt-4 border-t border-[var(--border)]">
      <p className="text-xs font-mono text-[var(--blue)] mb-3 uppercase tracking-widest">Attribution tuteur</p>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <select value={selected} onChange={e => setSelected(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm border border-[var(--border)]
              bg-[var(--bg-card)] text-[var(--text-primary)]
              focus:outline-none focus:ring-2 focus:border-[rgba(79,142,247,0.4)] focus:ring-[rgba(79,142,247,0.15)]">
            <option value="">Sélectionner un tuteur...</option>
            {TUTEURS.map(t => <option key={t} value={t} style={{background:'var(--bg-base)'}}>{t}</option>)}
          </select>
        </div>
        <Button variant="primary" size="sm"
          disabled={!selected || selected === project.tuteur}
          onClick={() => selected && onAssign(project.id, selected)}>
          <UserCheck className="w-3.5 h-3.5" /> Assigner
        </Button>
      </div>
      {project.tuteur && (
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Tuteur actuel : <span className="text-[var(--text-secondary)]">{project.tuteur}</span>
        </p>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────── */
export function Projets() {
  const user = useAuthStore(s => s.user);
  const role = user?.role ?? 'etudiant';

  const [projects, setProjects]     = useState<Project[]>(initial);
  const [showForm, setShowForm]     = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const onSubmit = async (data: ProjectFormData) => {
    await new Promise(r => setTimeout(r, 700));
    const p: Project = {
      id: crypto.randomUUID(), ...data,
      technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
      status: 'en_attente',
      submittedBy: user?.name ?? 'Étudiant',
      createdAt: new Date().toISOString().split('T')[0],
      jiraKey: `SCRUM-${Math.floor(Math.random()*30)+11}`,
    };
    setProjects(prev => [p, ...prev]);
    reset(); setShowForm(false);
  };

  const onEdit = (id: string, data: ProjectFormData) => {
    setProjects(prev => prev.map(p => p.id === id ? {
      ...p, title: data.title, description: data.description,
      type: data.type, mode: data.mode,
      technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean),
    } : p));
    setEditingId(null);
  };

  const onResubmit = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'en_attente', feedback: undefined } : p));
  };

  const onValidate = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'valide' } : p));
  };

  const onReject = (id: string, comment: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'refuse', feedback: comment } : p));
  };

  const onAssign = (id: string, tuteur: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, tuteur } : p));
  };

  const visible = role === 'etudiant'
    ? projects.filter(p => p.submittedBy === 'Ahmed Ben Salah' || p.submittedBy === user?.name)
    : role === 'tuteur'
    ? projects.filter(p => p.tuteur === 'Dr. Sami Trabelsi' || !p.tuteur)
    : projects;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Projets</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {role === 'etudiant' ? 'Soumission et suivi de vos propositions'
              : role === 'tuteur' ? 'Projets qui vous sont attribués'
              : 'Vue globale des propositions'}
          </p>
        </div>
        {role === 'etudiant' && (
          <Button variant="gold" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Nouvelle proposition</>}
          </Button>
        )}
      </div>

      {showForm && role === 'etudiant' && (
        <Card accent="gold">
          <CardHeader><CardTitle>Proposer un projet</CardTitle></CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Titre du projet" placeholder="Ex : Plateforme de gestion PFE"
              error={errors.title?.message} {...register('title')} />
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
              <textarea rows={4} placeholder="Décrivez objectifs, fonctionnalités, contexte..."
                {...register('description')}
                className={`w-full rounded-xl px-4 py-3 text-sm border bg-[var(--bg-card)]
                  text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                  focus:outline-none focus:ring-2 resize-none
                  ${errors.description ? 'border-red-500/40' : 'border-[var(--border)] focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]'}`} />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Type"
                options={[{value:'academique',label:'Académique'},{value:'entreprise',label:'Entreprise'}]}
                placeholder="Sélectionnez..." error={errors.type?.message} {...register('type')} />
              <Select label="Mode"
                options={[{value:'solo',label:'Solo'},{value:'binome',label:'Binôme'}]}
                placeholder="Sélectionnez..." error={errors.mode?.message} {...register('mode')} />
            </div>
            <Input label="Technologies (séparées par des virgules)"
              placeholder="Ex : React, TypeScript, Node.js"
              error={errors.technologies?.message} {...register('technologies')} />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Annuler</Button>
              <Button type="submit" variant="gold" loading={isSubmitting}>Soumettre la proposition</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-3">
        {(['en_attente','valide','en_cours','refuse'] as ProjectStatus[]).map(status => {
          const count = visible.filter(p => p.status === status).length;
          const cfg = statusCfg[status];
          return (
            <Card key={status} className="text-center py-4">
              <p className="text-2xl font-display font-bold text-[var(--text-primary)]">{count}</p>
              <Badge variant={cfg.variant} className="mt-1">{cfg.label}</Badge>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <Card><p className="text-sm text-center text-[var(--text-muted)] py-4">Aucun projet à afficher.</p></Card>
        )}
        {visible.map(project => {
          const cfg = statusCfg[project.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expandedId === project.id;
          const isEditing  = editingId  === project.id;
          const canEdit    = role === 'etudiant' && project.status === 'en_attente';
          const canResubmit = role === 'etudiant' && project.status === 'refuse';

          return (
            <Card key={project.id} hover>
              <div className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : project.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon className={`w-4 h-4 shrink-0 ${
                    cfg.variant === 'success' ? 'text-green-400'
                    : cfg.variant === 'danger' ? 'text-red-400'
                    : cfg.variant === 'warning' ? 'text-amber-400'
                    : 'text-[var(--blue)]'}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-primary)] truncate">{project.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {project.jiraKey && <span className="font-mono text-xs text-[var(--blue)]">{project.jiraKey}</span>}
                      <span className="text-xs text-[var(--text-muted)]">{project.submittedBy}</span>
                      <span className="text-xs text-[var(--border)]">·</span>
                      <span className="text-xs text-[var(--text-muted)]">{project.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  <Badge variant="muted">{project.type === 'academique' ? 'Académique' : 'Entreprise'}</Badge>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
                </div>
              </div>

              {isExpanded && !isEditing && (
                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                  <p className="text-sm text-[var(--text-secondary)]">{project.description}</p>

                  {project.feedback && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <MessageSquare className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-mono text-red-400 mb-1">Remarques du tuteur</p>
                        <p className="text-sm text-[var(--text-secondary)]">{project.feedback}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs font-mono border
                        text-[var(--text-secondary)] bg-[var(--bg-elevated)] border-[var(--border)]">{t}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--text-muted)]">Mode : </span>
                      <span className="text-[var(--text-secondary)]">{project.mode === 'binome' ? 'Binôme' : 'Solo'}</span>
                    </div>
                    {project.tuteur && (
                      <div>
                        <span className="text-[var(--text-muted)]">Tuteur : </span>
                        <span className="text-[var(--text-secondary)]">{project.tuteur}</span>
                      </div>
                    )}
                  </div>

                  {canEdit && (
                    <div className="flex gap-2 pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(project.id)}>
                        <Pencil className="w-3.5 h-3.5" /> Modifier la proposition
                      </Button>
                    </div>
                  )}

                  {canResubmit && (
                    <div className="flex gap-2 pt-1">
                      <Button variant="gold" size="sm" onClick={() => onResubmit(project.id)}>
                        <RotateCcw className="w-3.5 h-3.5" /> Resoumettre après correction
                      </Button>
                    </div>
                  )}

                  {role === 'tuteur' && project.status === 'en_attente' && (
                    <TutorActions project={project} onValidate={onValidate} onReject={onReject} />
                  )}

                  {role === 'coordinateur' && (
                    <CoordActions project={project} onAssign={onAssign} />
                  )}
                </div>
              )}

              {isExpanded && isEditing && (
                <EditForm
                  project={project}
                  onSave={data => onEdit(project.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
