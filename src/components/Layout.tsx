import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  FileText,
  Award,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../store/authStore';
import { Badge } from './ui/Badge';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/groupe', label: 'Équipe', icon: Users },
  { path: '/projets', label: 'Projets', icon: FolderOpen },
  { path: '/compte-rendus', label: 'Compte-rendus', icon: FileText },
  { path: '/soutenance', label: 'Soutenance', icon: Award },
];

const roleLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'info' }> = {
  etudiant: { label: 'Étudiant', variant: 'default' },
  tuteur: { label: 'Tuteur', variant: 'success' },
  coordinateur: { label: 'Coordinateur', variant: 'warning' },
  jury: { label: 'Jury', variant: 'info' },
};

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleInfo = user ? roleLabels[user.role] : null;

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800/80 z-30 transition-transform duration-300 flex flex-col',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slate-100 text-sm leading-tight">PF–FST-SBZ</p>
            <p className="text-xs text-slate-500">2025–2026</p>
          </div>
          <button
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{user.name}</p>
                {roleInfo && <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300')} />
                {label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-400/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800/80 flex items-center px-4 gap-4 shrink-0 sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
          <button
            className="lg:hidden text-slate-400 hover:text-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500 hidden sm:block">SCRUM ·</span>
            <span className="font-mono text-xs text-blue-400">FST-SBZ 2025-2026</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
