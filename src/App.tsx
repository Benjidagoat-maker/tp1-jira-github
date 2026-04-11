import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Groupe } from './pages/Groupe';
import { Projets } from './pages/Projets';
import { CompteRendus } from './pages/CompteRendus';
import { Soutenance } from './pages/Soutenance';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export function App() {
  // ← Add auth check hook
  const checkAuth = useAuthStore((s) => s.checkAuth);
  
  useEffect(() => {
    const unsubscribe = checkAuth();
    return () => unsubscribe?.();
  }, [checkAuth]);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/groupe" element={<AppLayout><Groupe /></AppLayout>} />
        <Route path="/projets" element={<AppLayout><Projets /></AppLayout>} />
        <Route path="/compte-rendus" element={<AppLayout><CompteRendus /></AppLayout>} />
        <Route path="/soutenance" element={<AppLayout><Soutenance /></AppLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}