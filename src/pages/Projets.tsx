import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { Project, ProjectStatus } from '../types';

const projectSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères'),
  description: z.string().min(20, 'La description doit contenir au moins 20 caractères'),
  type: z.enum(['academique', 'entreprise'], { required_error: 'Sélectionnez un type' }),
  mode: z.enum(['solo', 'binome'], { required_error: 'Sélectionnez un mode' }),
  technologies: z.string().min(1, 'Indiquez au moins une technologie'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Plateforme PF FST-SBZ',
    description: 'Application web complète pour la gestion des projets de fin d\'études avec intégration Jira + GitHub.',
    type: 'academique',
    mode: 'solo',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    status: 'en_cours',
    submittedBy: 'Ahmed Ben Salah',
    tuteur: 'Dr. Sami Trabelsi',
    createdAt: '2025-10-01',
    jiraKey: 'SCRUM-5',
  },
  {
    id: '2',
    title: 'Système de gestion RH',
    description: 'Application de gestion des ressources humaines pour une PME tunisienne avec module de paie.',
    type: 'entreprise',
    mode: 'binome',
    technologies: ['Spring Boot', 'Angular', 'PostgreSQL'],
    status: 'valide',
    submittedBy: 'Fatma Mejri',
    tuteur: 'Dr. Sami Trabelsi',
    createdAt: '2025-10-05',
    jiraKey: 'SCRUM-6',
  },
  {
    id: '3',
    title: 'App mobile étudiants',
    description: 'Application mobile pour la gestion des emplois du temps et des notes à la FST-SBZ.',
    type: 'academique',
    mode: 'binome',
    technologies: ['React Native', 'Expo', 'Firebase'],
    status: 'en_attente',
    submittedBy: 'Mohamed Khalil',
    createdAt: '2025-10-10',
    jiraKey: 'SCRUM-7',
  },
  {
    id: '4',
    title: 'Portail e-learning',
    description: 'Plateforme d\'apprentissage en ligne avec cours vidéo, quiz interactifs et suivi de progression.',
    type: 'academique',
    mode: 'solo',
    technologies: ['Next.js', 'Node.js', 'MongoDB'],
    status: 'refuse',
    submittedBy: 'Sarra Boughanmi',
    createdAt: '2025-10-12',
    jiraKey: 'SCRUM-8',
  },
];

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'; icon: typeof CheckCircle2 }> = {
  en_attente: { label: 'En attente', variant: 'warning', icon: Clock },
  valide: { label: 'Validé', variant: 'success', icon: CheckCircle2 },
  refuse: { label: 'Refusé', variant: 'danger', icon: XCircle },
  en_cours: { label: 'En cours', variant: 'default', icon: Clock },
  soumis: { label: 'Soumis', variant: 'info', icon: Clock },
  soutenu: { label: 'Soutenu', variant: 'success', icon: CheckCircle2 },
};

export function Projets() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const onSubmit = async (data: ProjectFormData) => {
    await new Promise((r) => setTimeout(r, 700));
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      type: data.type,
      mode: data.mode,
      technologies: data.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      status: 'en_attente',
      submittedBy: 'Ahmed Ben Salah',
      createdAt: new Date().toISOString().split('T')[0],
      jiraKey: `SCRUM-${Math.floor(Math.random() * 30) + 11}`,
    };
    setProjects((prev) => [newProject, ...prev]);
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Projets</h1>
          <p className="text-sm text-slate-400 mt-1">Soumission et suivi des propositions de projets</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Annuler</> : <><Plus className="w-4 h-4" /> Nouvelle proposition</>}
        </Button>
      </div>

      {/* Submission form */}
      {showForm && (
        <Card className="border-blue-600/30 bg-blue-600/5">
          <CardHeader>
            <CardTitle>Proposer un projet</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Titre du projet"
              placeholder="Ex : Plateforme de gestion des projets PFE"
              error={errors.title?.message}
              {...register('title')}
            />
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea
                placeholder="Décrivez votre projet en détail (objectifs, fonctionnalités, contexte)..."
                rows={4}
                className={`w-full bg-slate-900/50 border rounded-lg px-3.5 py-2.5 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors resize-none ${errors.description ? 'border-red-500/50' : 'border-slate-700/80'}`}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Type"
                options={[{ value: 'academique', label: 'Académique' }, { value: 'entreprise', label: 'Entreprise' }]}
                placeholder="Sélectionnez..."
                error={errors.type?.message}
                {...register('type')}
              />
              <Select
                label="Mode"
                options={[{ value: 'solo', label: 'Solo' }, { value: 'binome', label: 'Binôme' }]}
                placeholder="Sélectionnez..."
                error={errors.mode?.message}
                {...register('mode')}
              />
            </div>
            <Input
              label="Technologies (séparées par des virgules)"
              placeholder="Ex : React, TypeScript, Node.js, PostgreSQL"
              error={errors.technologies?.message}
              {...register('technologies')}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>Annuler</Button>
              <Button type="submit" loading={isSubmitting}>Soumettre la proposition</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3">
        {(['en_attente', 'valide', 'en_cours', 'refuse'] as ProjectStatus[]).map((status) => {
          const count = projects.filter((p) => p.status === status).length;
          const cfg = statusConfig[status];
          return (
            <Card key={status} className="text-center py-4">
              <p className="text-2xl font-display font-bold text-slate-100">{count}</p>
              <Badge variant={cfg.variant} className="mt-1">{cfg.label}</Badge>
            </Card>
          );
        })}
      </div>

      {/* Projects list */}
      <div className="space-y-3">
        {projects.map((project) => {
          const cfg = statusConfig[project.status];
          const StatusIcon = cfg.icon;
          const isExpanded = expandedId === project.id;

          return (
            <Card key={project.id} className="cursor-pointer" hover>
              <div
                className="flex items-center justify-between"
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <StatusIcon className={`w-4 h-4 shrink-0 ${cfg.variant === 'success' ? 'text-green-400' : cfg.variant === 'danger' ? 'text-red-400' : cfg.variant === 'warning' ? 'text-amber-400' : 'text-blue-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100 truncate">{project.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {project.jiraKey && (
                        <span className="font-mono text-xs text-blue-400">{project.jiraKey}</span>
                      )}
                      <span className="text-xs text-slate-500">{project.submittedBy}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{project.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  <Badge variant="muted">{project.type === 'academique' ? 'Académique' : 'Entreprise'}</Badge>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                  <p className="text-sm text-slate-400">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-700/60 rounded text-xs text-slate-300 font-mono border border-slate-600/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Mode : </span>
                      <span className="text-slate-300">{project.mode === 'binome' ? 'Binôme' : 'Solo'}</span>
                    </div>
                    {project.tuteur && (
                      <div>
                        <span className="text-slate-500">Tuteur : </span>
                        <span className="text-slate-300">{project.tuteur}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
