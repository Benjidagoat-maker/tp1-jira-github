import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Zap, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { Role } from '../types';

/* ── Password strength ──────────────────────────────────── */
function getPasswordStrength(pwd: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'You need a stronger password.', color: 'text-red-400' };
  if (score <= 3) return { score: 2, label: 'Mot de passe acceptable.', color: 'text-amber-400' };
  return { score: 3, label: 'Mot de passe fort !', color: 'text-green-400' };
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['etudiant', 'tuteur', 'coordinateur', 'jury'], {
    required_error: 'Sélectionnez un rôle',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roleOptions = [
  { value: 'etudiant',     label: 'Étudiant' },
  { value: 'tuteur',       label: 'Tuteur' },
  { value: 'coordinateur', label: 'Coordinateur pédagogique' },
  { value: 'jury',         label: 'Membre du Jury' },
];

function BgBlob() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
    </div>
  );
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp]         = useState(false);
  const [authError, setAuthError]       = useState<string | null>(null);

  const [forgotMode,    setForgotMode]    = useState(false);
  const [forgotEmail,   setForgotEmail]   = useState('');
  const [forgotSent,    setForgotSent]    = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError,   setForgotError]   = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, loginWithGitHub, register: registerUser, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const watchedPassword = watch('password', '');
  const strength        = getPasswordStrength(watchedPassword);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    clearError();
    try {
      if (isSignUp) {
        const name = data.email
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        await registerUser(data.email, data.password, name, data.role as Role);
      } else {
        await login(data.email, data.password, data.role as Role);
      }
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message);
      }
    }
  };

  const handleGithubLogin = async () => {
    const selectedRole = watch('role');
    const role: Role =
      selectedRole === 'etudiant' ||
      selectedRole === 'tuteur' ||
      selectedRole === 'coordinateur' ||
      selectedRole === 'jury'
        ? selectedRole
        : 'etudiant';
    await loginWithGitHub(role);
  };

  /* ── Forgot password via Supabase ─── */
  const handleForgotPassword = async () => {
    if (!forgotEmail) { setForgotError('Veuillez entrer votre adresse email.'); return; }
    setForgotLoading(true);
    setForgotError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (err) {
      setForgotError(
        err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setAuthError(null);
    clearError();
    reset();
  };

  /* ── Forgot-password view ── */
  if (forgotMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <BgBlob />
        <header className="px-6 py-4 border-b border-slate-800/80 flex items-center">
          <button
            onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); setForgotError(null); }}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/30">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-slate-100">Mot de passe oublié</h1>
                <p className="text-slate-400 text-sm mt-1">Réinitialisation par email</p>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
              {forgotSent ? (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                  <div>
                    <p className="font-semibold text-slate-100 text-lg">Email envoyé !</p>
                    <p className="text-sm text-slate-400 mt-2">
                      Un lien de réinitialisation a été envoyé à{' '}
                      <strong className="text-slate-200">{forgotEmail}</strong>.
                    </p>
                  </div>
                  <Button variant="ghost" className="w-full"
                    onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); }}>
                    Retour à la connexion
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-sm text-slate-400">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                  </p>
                  {forgotError && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-400">{forgotError}</p>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-300">Adresse email</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full bg-slate-900/50 border border-slate-700/80 rounded-lg px-3.5 py-2.5
                        text-slate-100 text-sm placeholder:text-slate-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
                      onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                    />
                  </div>
                  <Button variant="primary" className="w-full" onClick={handleForgotPassword}
                    loading={forgotLoading} disabled={!forgotEmail}>
                    <Mail className="w-4 h-4" />
                    Envoyer le lien de réinitialisation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main Login / Signup view ── */
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <BgBlob />

      <header className="px-6 py-4 border-b border-slate-800/80 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-100">
                {isSignUp ? 'Créer un compte' : 'Connexion'}
              </h1>
              <p className="text-slate-400 text-sm mt-1">Plateforme PF - FST-SBZ</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            {(authError || error) && (
              <div className="mb-5 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{authError || error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <Select label="Rôle" options={roleOptions} placeholder="Sélectionnez votre rôle"
                error={errors.role?.message} {...register('role')} />

              <Input label="Adresse email" type="email" placeholder="votre@email.com"
                error={errors.email?.message} {...register('email')} />

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 caractères"
                    className={[
                      'w-full bg-slate-900/50 border rounded-lg px-3.5 py-2.5',
                      'text-slate-100 text-sm placeholder:text-slate-500 pr-10',
                      'focus:outline-none focus:ring-2 transition-colors',
                      errors.password
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : isSignUp && watchedPassword && strength.score === 1
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : isSignUp && watchedPassword && strength.score === 2
                        ? 'border-amber-500/50 focus:ring-amber-400/30'
                        : isSignUp && watchedPassword && strength.score === 3
                        ? 'border-green-500/40 focus:ring-green-500/20'
                        : 'border-slate-700/80 focus:ring-blue-500/50 focus:border-blue-500/50',
                    ].join(' ')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {isSignUp && watchedPassword.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={[
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          strength.score >= i
                            ? strength.score === 1 ? 'bg-red-500'
                              : strength.score === 2 ? 'bg-amber-400' : 'bg-green-400'
                            : 'bg-slate-700',
                        ].join(' ')} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.color}`}>{strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                {isSubmitting
                  ? isSignUp ? 'Création en cours...' : 'Connexion en cours...'
                  : isSignUp ? "S'inscrire" : 'Se connecter'}
              </Button>
            </form>

            {!isSignUp && (
              <div className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleGithubLogin}
                >
                  Continuer avec GitHub
                </Button>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button type="button" onClick={toggleMode}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
              </button>
              {!isSignUp && (
                <button type="button" onClick={() => setForgotMode(true)}
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  Mot de passe oublié ?
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Projet Fédéré SI2 - Université de Kairouan
          </p>
        </div>
      </div>
    </div>
  );
}
