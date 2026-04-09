import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, FileText, Award,
  LogOut, Menu, X, GitBranch,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { path: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/groupe',        label: 'Équipe',         icon: Users },
  { path: '/projets',       label: 'Projets',        icon: FolderOpen },
  { path: '/compte-rendus', label: 'Compte-rendus',  icon: FileText },
  { path: '/soutenance',    label: 'Soutenance',     icon: Award },
];

const roleConfig: Record<string, { label: string; color: string }> = {
  etudiant:     { label: 'Étudiant',      color: 'var(--gold)' },
  tuteur:       { label: 'Tuteur',        color: 'var(--teal)' },
  coordinateur: { label: 'Coordinateur', color: 'var(--blue)' },
  jury:         { label: 'Jury',          color: '#a78bfa' },
};

interface LayoutProps { children: ReactNode }

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => { logout(); navigate('/'); };
  const role = user ? roleConfig[user.role] : null;

  const Sidebar = () => (
    <aside className={clsx(
      'fixed top-0 left-0 h-full w-60 z-30 flex flex-col',
      'border-r border-[var(--border)]',
      'bg-[var(--bg-surface)]',
      'transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--border)]">
        <div className="relative w-8 h-8 shrink-0">
          <div className="absolute inset-0 clip-diamond bg-gradient-to-br from-[var(--gold)] to-[#c87a1a]" />
          <GitBranch className="absolute inset-0 m-auto w-3.5 h-3.5 text-[#080c18]" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-[var(--text-primary)] text-sm tracking-tight">PF–FST‑SBZ</p>
          <p className="font-mono text-[10px] text-[var(--text-muted)]">2025–2026</p>
        </div>
        <button
          className="ml-auto lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User card */}
      {user && role && (
        <div className="mx-3 my-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            {/* Avatar with role-color ring */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center
                bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)]
                text-sm font-bold text-[var(--text-primary)] border-2"
                style={{ borderColor: role.color }}>
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
              <p className="text-[10px] font-mono mt-0.5" style={{ color: role.color }}>
                {role.label}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'transition-all duration-150 group relative',
                isActive
                  ? 'text-[var(--text-primary)] bg-[var(--gold-dim)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2
                  w-0.5 h-5 rounded-r-full bg-[var(--gold)]" />
              )}
              <Icon className={clsx(
                'w-4 h-4 shrink-0 transition-colors',
                isActive ? 'text-[var(--gold)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
              )} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-[var(--border)] pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
            text-[var(--text-muted)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.08)]
            transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-13 border-b border-[var(--border)] flex items-center px-5 gap-4
          sticky top-0 z-10 bg-[rgba(8,12,24,0.85)] backdrop-blur-md shrink-0"
          style={{ height: '52px' }}>
          <button
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--text-muted)]">SCRUM</span>
            <span className="text-[var(--border)]">·</span>
            <span className="font-mono text-[11px] text-[var(--gold)]">FST-SBZ 2025-2026</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
