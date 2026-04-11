import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Groupe } from './pages/Groupe';
import { Projets } from './pages/Projets';
import { CompteRendus } from './pages/CompteRendus';
import { Soutenance } from './pages/Soutenance';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<AppLayout><Dashboard /></AppLayout>}
          />
          <Route
            path="/groupe"
            element={<AppLayout><Groupe /></AppLayout>}
          />
          <Route
            path="/projets"
            element={<AppLayout><Projets /></AppLayout>}
          />
          <Route
            path="/compte-rendus"
            element={<AppLayout><CompteRendus /></AppLayout>}
          />
          <Route
            path="/soutenance"
            element={<AppLayout><Soutenance /></AppLayout>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}
