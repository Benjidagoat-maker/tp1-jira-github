import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';

const resetSchema = z.object({
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

function BgBlob() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
    </div>
  );
}

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isInvalidCode, setIsInvalidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({ resolver: zodResolver(resetSchema) });

  useEffect(() => {
    if (!oobCode) {
      setIsInvalidCode(true);
      setIsValidating(false);
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setIsValidating(false);
      })
      .catch(() => {
        setIsInvalidCode(true);
        setIsValidating(false);
      });
  }, [oobCode]);

  const onSubmit = async (data: ResetFormData) => {
    setGlobalError(null);
    try {
      await confirmPasswordReset(auth, oobCode!, data.password);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setGlobalError("Impossible de réinitialiser le mot de passe. Le lien est peut-être expiré.");
      }
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Vérification du lien...</p>
      </div>
    );
  }

  if (isInvalidCode) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <BgBlob />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h1 className="text-xl font-bold text-slate-100">Lien invalide ou expiré</h1>
            <p className="text-slate-400 text-sm">
              Le lien de réinitialisation est invalide ou a déjà été utilisé.
            </p>
            <Button onClick={() => navigate('/')} className="w-full mt-4">
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <BgBlob />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <h1 className="text-xl font-bold text-slate-100">Mot de passe modifié !</h1>
            <p className="text-slate-400 text-sm">
              Votre mot de passe a été mis à jour avec succès.
            </p>
            <Button onClick={() => navigate('/')} className="w-full mt-4">
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <BgBlob />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/30">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-100">Nouveau mot de passe</h1>
              <p className="text-slate-400 text-sm mt-1">Pour le compte {email}</p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            {globalError && (
              <div className="mb-5 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{globalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 6 caractères"
                    className={[
                      'w-full bg-slate-900/50 border rounded-lg px-3.5 py-2.5',
                      'text-slate-100 text-sm placeholder:text-slate-500 pr-10',
                      'focus:outline-none focus:ring-2 transition-colors',
                      errors.password
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : 'border-slate-700/80 focus:ring-blue-500/50 focus:border-blue-500/50',
                    ].join(' ')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-300">Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Retaper le mot de passe"
                    className={[
                      'w-full bg-slate-900/50 border rounded-lg px-3.5 py-2.5',
                      'text-slate-100 text-sm placeholder:text-slate-500 pr-10',
                      'focus:outline-none focus:ring-2 transition-colors',
                      errors.confirmPassword
                        ? 'border-red-500/50 focus:ring-red-500/30'
                        : 'border-slate-700/80 focus:ring-blue-500/50 focus:border-blue-500/50',
                    ].join(' ')}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
                Réinitialiser le mot de passe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
