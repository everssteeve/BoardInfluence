import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth/authService';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Lock, KeyRound } from 'lucide-react';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await authService.updatePassword(data.password);

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Redirect to login on success with success message
      navigate('/login', {
        state: { message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' },
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la réinitialisation du mot de passe');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Réinitialisation du mot de passe
            </h1>
            <p className="text-gray-600">Entrez votre nouveau mot de passe</p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Reset password form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-11"
                  {...register('password')}
                  error={errors.password?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-11"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>BoardInfluence v3.0 - Gestion d'influenceurs jeux de société</p>
        </div>
      </div>
    </div>
  );
}
