import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FolderOpen, TrendingUp, Award, GitBranch, Layers } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const stats = [
  { value: '39', label: 'User Stories', sublabel: 'SCRUM-11 → SCRUM-49' },
  { value: '6', label: 'Épics', sublabel: 'Cycles complets' },
  { value: '4', label: 'Rôles', sublabel: 'Acteurs définis' },
  { value: '1', label: 'Équipe', sublabel: 'Projet fédéré' },
];

const features = [
  {
    icon: Shield,
    title: 'Accès Sécurisé',
    description: 'Authentification par rôle (Étudiant, Tuteur, Coordinateur, Jury) avec validation stricte.',
    accent: 'text-blue-400',
    bg: 'bg-blue-600/10',
    border: 'border-blue-600/20',
  },
  {
    icon: FolderOpen,
    title: 'Soumission Projets',
    description: 'Proposez et suivez vos projets académiques ou en entreprise, en solo ou en binôme.',
    accent: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Suivi Avancement',
    description: 'Déposez vos compte-rendus périodiques et suivez le statut de validation en temps réel.',
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Award,
    title: 'Soutenance',
    description: 'Soumettez votre rapport final, consultez la programmation de votre soutenance.',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

export function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Nav */}
      <nav className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-slate-100">PF–FST-SBZ</span>
        </div>
        <Link to="/login">
          <Button size="sm">Connexion <ArrowRight className="w-3.5 h-3.5" /></Button>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-6">
          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-1.5 text-sm text-blue-400 font-mono">
            <Layers className="w-3.5 h-3.5" />
            SI2 · FST-SBZ · 2025–2026
          </div>

          <h1 className="font-display font-bold text-5xl md:text-6xl leading-tight">
            Bienvenue sur la{' '}
            <span className="text-blue-500">plateforme PF</span>
            <br />
            <span className="text-slate-300">FST-SBZ</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Gérez vos projets de fin d\'études de bout en bout — de la proposition à la soutenance,
            avec une intégration Jira + GitHub complète.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/login">
              <Button size="lg">
                Accéder à la plateforme
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <div className="text-4xl font-display font-bold text-blue-400 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-200">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-1 font-mono">{stat.sublabel}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="font-display font-bold text-2xl text-slate-100">Fonctionnalités</h2>
            <p className="text-slate-400 mt-2">Tout ce dont vous avez besoin pour gérer votre projet fédéré</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <Card key={f.title} hover className={`border ${f.border}`}>
                <div className={`w-10 h-10 ${f.bg} ${f.border} border rounded-lg flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.accent}`} />
                </div>
                <h3 className="font-display font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8">
          <Card className="bg-gradient-to-br from-blue-600/10 to-slate-800/60 border-blue-600/20">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl text-slate-100">Prêt à commencer ?</h2>
              <p className="text-slate-400">Connectez-vous avec votre compte institutionnel FST-SBZ.</p>
              <Link to="/login">
                <Button size="lg">
                  Se connecter maintenant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center">
        <p className="text-sm text-slate-500 font-mono">
          Projet Fédéré SI2 · FST-SBZ · <span className="text-slate-400">Université de Kairouan</span>
        </p>
      </footer>
    </div>
  );
}
