import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/auth/authService';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const { error } = await authService.requestPasswordReset(data.email);

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Une erreur est survenue lors de la demande de réinitialisation');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
            <p className="text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Success alert */}
          {success && (
            <Alert variant="success" className="mb-6">
              Un email de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de
              réception et suivez les instructions.
            </Alert>
          )}

          {/* Forgot password form */}
          {!success && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-11"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>
          )}

          {/* Back to login link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>BoardInfluence v3.0 - Gestion d'influenceurs jeux de société</p>
        </div>
      </div>
    </div>
  );
}
