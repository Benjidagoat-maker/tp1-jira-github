import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, FolderOpen, TrendingUp, Award, GitBranch } from 'lucide-react';
import { Button } from '../components/ui/Button';

/* ── Zellige-inspired SVG pattern ──────────────────── */
function ZelligePattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="zellige" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          {/* Octagonal star motif */}
          <polygon points="32,4 44,12 60,12 60,28 52,32 60,36 60,52 44,52 32,60 20,52 4,52 4,36 12,32 4,28 4,12 20,12"
            fill="none" stroke="#e8a83a" strokeWidth="0.8" />
          <polygon points="32,16 40,22 48,22 48,30 44,32 48,34 48,42 40,42 32,48 24,42 16,42 16,34 20,32 16,30 16,22 24,22"
            fill="none" stroke="#4f8ef7" strokeWidth="0.5" />
          <circle cx="32" cy="32" r="3" fill="none" stroke="#e8a83a" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  );
}

/* ── Animated orbs ──────────────────────────────────── */
function Orbs() {
  return (
    <>
      <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full
        bg-gradient-radial from-[rgba(232,168,58,0.07)] to-transparent pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full
        bg-gradient-radial from-[rgba(79,142,247,0.08)] to-transparent pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full
        bg-gradient-radial from-[rgba(45,212,191,0.05)] to-transparent pointer-events-none" />
    </>
  );
}

const stats = [
  { value: '39', label: 'User Stories', mono: 'SCRUM-11→49' },
  { value: '6',  label: 'Épics',        mono: 'Cycles complets' },
  { value: '4',  label: 'Rôles',        mono: 'Acteurs définis' },
  { value: '1',  label: 'Équipe',       mono: 'Projet fédéré' },
];

const features = [
  {
    icon: Shield,
    title: 'Accès Sécurisé',
    desc: 'Authentification par rôle — Étudiant, Tuteur, Coordinateur, Jury.',
    color: 'var(--gold)',
    dim: 'var(--gold-dim)',
  },
  {
    icon: FolderOpen,
    title: 'Soumission Projets',
    desc: 'Proposez et suivez vos projets académiques ou entreprise, solo ou binôme.',
    color: 'var(--blue)',
    dim: 'var(--blue-dim)',
  },
  {
    icon: TrendingUp,
    title: 'Suivi Avancement',
    desc: 'Déposez vos compte-rendus périodiques, suivez la validation en temps réel.',
    color: 'var(--teal)',
    dim: 'var(--teal-dim)',
  },
  {
    icon: Award,
    title: 'Soutenance',
    desc: 'Rapport final, planning de soutenance et checklist de préparation.',
    color: '#a78bfa',
    dim: 'rgba(167,139,250,0.1)',
  },
];

export function Home() {
  /* Stagger in elements on mount */
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = heroRef.current?.querySelectorAll('.stagger');
    els?.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 120}ms`;
      el.classList.add('animate-fade-up');
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}>

      <ZelligePattern />
      <Orbs />

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="relative z-20 border-b border-[var(--border)] px-6 py-4
        flex items-center justify-between sticky top-0
        bg-[rgba(8,12,24,0.85)] backdrop-blur-lg">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 clip-diamond bg-gradient-to-br from-[var(--gold)] to-[#c87a1a]" />
            <GitBranch className="absolute inset-0 m-auto w-4 h-4 text-[#080c18]" />
          </div>
          <div>
            <span className="font-display font-bold text-[var(--text-primary)] tracking-tight">PF–FST‑SBZ</span>
            <span className="hidden sm:inline font-mono text-xs text-[var(--text-muted)] ml-3">2025–2026</span>
          </div>
        </div>

        <Link to="/login">
          <Button variant="gold" size="sm">
            Connexion <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <section ref={heroRef} className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Eyebrow tag */}
        <div className="stagger inline-flex items-center gap-2.5 mb-8
          bg-[var(--gold-dim)] border border-[rgba(232,168,58,0.2)]
          rounded-full px-5 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse-ring" />
          <span className="font-mono text-xs text-[var(--gold)] tracking-widest uppercase">
            Projet Fédéré · SI2 · Université de Kairouan
          </span>
        </div>

        {/* Headline */}
        <h1 className="stagger font-display font-bold text-6xl md:text-7xl lg:text-8xl
          leading-[0.92] tracking-tight mb-8 max-w-4xl">
          <span className="text-[var(--text-primary)]">Plateforme</span>
          <br />
          <span className="text-gradient-gold">Projets de Fin</span>
          <br />
          <span className="text-[var(--text-secondary)]">d'Études</span>
        </h1>

        <p className="stagger text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed mb-12">
          De la proposition à la soutenance — gérez votre projet PFE
          avec une intégration <span className="text-[var(--text-primary)]">Jira + GitHub</span> complète.
        </p>

        {/* CTA row */}
        <div className="stagger flex flex-col sm:flex-row gap-4 mb-24">
          <Link to="/login">
            <Button variant="gold" size="lg">
              Accéder à la plateforme
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a
            href="https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM/list?jql=project%20%3D%20SCRUM%20ORDER%20BY%20created%20DESC"
            target="_blank" rel="noopener noreferrer"
          >
            <Button variant="ghost" size="lg">
              Voir le backlog SCRUM
            </Button>
          </a>
        </div>

        {/* Stats row — horizontal rule style */}
        <div className="stagger grid grid-cols-2 md:grid-cols-4 gap-px
          bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
          {stats.map((s, i) => (
            <div key={i} className="bg-[var(--bg-card)] px-6 py-5 text-center">
              <div className="font-display font-bold text-4xl text-gradient-gold mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">{s.label}</div>
              <div className="font-mono text-xs text-[var(--text-muted)]">{s.mono}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="font-mono text-xs text-[var(--gold)] tracking-widest uppercase mb-3">
            — Fonctionnalités
          </p>
          <h2 className="font-display font-bold text-4xl text-[var(--text-primary)]">
            Tout le cycle PFE,<br />en un seul endroit.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="group relative rounded-xl p-6 border border-[var(--border)]
                bg-[var(--bg-card)] overflow-hidden
                hover:border-[var(--border-light)] transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/30">
              {/* Accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0
                group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: f.color, opacity: 0.05 }} />

              <div className="relative">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.dim, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Roles strip ──────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-[var(--border-light)]
          bg-[var(--bg-card)] overflow-hidden">
          {/* Top bar */}
          <div className="px-8 py-6 border-b border-[var(--border)] flex items-center gap-3">
            <p className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
              Rôles disponibles
            </p>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          {/* Role list */}
          <div className="grid sm:grid-cols-4 divide-x divide-[var(--border)]">
            {[
              { role: 'Étudiant', email: 'ahmed.bensalah', color: 'var(--gold)', icon: '🎓' },
              { role: 'Tuteur',   email: 'sami.trabelsi',  color: 'var(--teal)', icon: '👨‍🏫' },
              { role: 'Coordinateur', email: 'leila.mansouri', color: 'var(--blue)', icon: '🗂️' },
              { role: 'Jury',    email: 'karim.jebali',   color: '#a78bfa', icon: '⚖️' },
            ].map((r) => (
              <div key={r.role} className="px-6 py-6">
                <div className="text-2xl mb-3">{r.icon}</div>
                <div className="font-display font-bold text-[var(--text-primary)] mb-1">
                  {r.role}
                </div>
                <div className="font-mono text-xs text-[var(--text-muted)] truncate">
                  {r.email}@fstsbz.u-kairouan.tn
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="relative rounded-2xl overflow-hidden
          bg-gradient-to-br from-[rgba(232,168,58,0.08)] to-[rgba(79,142,247,0.05)]
          border border-[rgba(232,168,58,0.2)] p-12 text-center">
          <ZelligePattern />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)] mb-4">
              Prêt à commencer votre PFE ?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
              Connectez-vous avec votre adresse institutionnelle <span className="font-mono text-[var(--text-primary)] text-xs">@fstsbz.u-kairouan.tn</span>
            </p>
            <Link to="/login">
              <Button variant="gold" size="lg">
                Se connecter maintenant <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8 px-6
        flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 clip-diamond bg-gradient-to-br from-[var(--gold)] to-[#c87a1a]" />
          <span className="font-mono text-xs text-[var(--text-muted)]">
            PF–FST-SBZ · Université de Kairouan · SI2 2025–2026
          </span>
          <span className="ml-2 px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-mono">
            v0.2.3 Stable
          </span>
        </div>
        <a
          href="https://benji-d-goat1998.atlassian.net/jira/software/projects/SCRUM/list?jql=project%20%3D%20SCRUM%20ORDER%20BY%20created%20DESC"
          target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
        >
          SCRUM Board ↗
        </a>
      </footer>
    </div>
  );
}
