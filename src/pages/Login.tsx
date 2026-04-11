import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import type { Role } from '../types';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Adresse email invalide')
    .endsWith('@fstsbz.u-kairouan.tn', 'Doit être une adresse @fstsbz.u-kairouan.tn'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['etudiant', 'tuteur', 'coordinateur', 'jury'], {
    required_error: 'Sélectionnez un rôle',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roleOptions = [
  { value: 'etudiant', label: '🎓 Étudiant' },
  { value: 'tuteur', label: '👨‍🏫 Tuteur' },
  { value: 'coordinateur', label: '🗂️ Coordinateur pédagogique' },
  { value: 'jury', label: '⚖️ Membre du Jury' },
];

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
  try {
    await login(data.email, data.password, data.role); // Now calls real Firebase!
    navigate('/dashboard');
  } catch (error: any) {
    console.error('Login failed:', error.message);
  }
};

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800/80 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/30">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-100">Connexion</h1>
              <p className="text-slate-400 text-sm mt-1">Plateforme PF – FST-SBZ</p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Role selector */}
              <Select
                label="Rôle"
                options={roleOptions}
                placeholder="Sélectionnez votre rôle"
                error={errors.role?.message}
                {...register('role')}
              />

              {/* Email */}
              <Input
                label="Adresse email institutionnelle"
                type="email"
                placeholder="prenom.nom@fstsbz.u-kairouan.tn"
                hint="Doit se terminer par @fstsbz.u-kairouan.tn"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full bg-slate-900/50 border rounded-lg px-3.5 py-2.5 text-slate-100 text-sm placeholder:text-slate-500 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors ${
                      errors.password ? 'border-red-500/50' : 'border-slate-700/80'
                    }`}
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
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-500">
            Projet Fédéré SI2 · Université de Kairouan
          </p>
        </div>
      </div>
    </div>
  );
}
