import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { UserPlus, Mail, Lock, User, Building2 } from 'lucide-react';

const signupSchema = z
  .object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string(),
    company: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        company: data.company,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h1>
            <p className="text-gray-600">Créez votre compte BoardInfluence</p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  
                  type="text"
                  placeholder="Jean Dupont"
                  className="pl-11"
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
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

            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise (optionnel)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  
                  type="text"
                  placeholder="Nom de votre entreprise"
                  className="pl-11"
                  {...register('company')}
                  error={errors.company?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
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
              <label
                
                className="block text-sm font-medium text-gray-700 mb-2"
              >
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
              {isLoading ? 'Création du compte...' : 'Créer un compte'}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Se connecter
              </Link>
            </p>
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
