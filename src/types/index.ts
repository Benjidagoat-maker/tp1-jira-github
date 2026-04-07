export type Role = 'etudiant' | 'tuteur' | 'coordinateur' | 'jury';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  email: string;
  specialty?: string;
}

export type ProjectStatus = 'en_attente' | 'valide' | 'refuse' | 'en_cours' | 'soumis' | 'soutenu';
export type ProjectType = 'academique' | 'entreprise';
export type ProjectMode = 'solo' | 'binome';

export interface Project {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  mode: ProjectMode;
  technologies: string[];
  status: ProjectStatus;
  submittedBy: string;
  tuteur?: string;
  createdAt: string;
  jiraKey?: string;
}

export interface CompteRendu {
  id: string;
  projectId: string;
  title: string;
  submittedAt: string;
  status: 'en_attente' | 'valide' | 'rejete';
  fileName: string;
  period: string;
}

export interface Soutenance {
  id: string;
  projectId: string;
  projectTitle: string;
  date: string;
  time: string;
  room: string;
  jury: string[];
  status: 'planifie' | 'en_cours' | 'termine';
  note?: number;
}

export interface Epic {
  key: string;
  title: string;
  storiesCount: number;
  completed: number;
}
