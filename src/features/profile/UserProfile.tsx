import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { Card } from '@/components/common/Card';
import { User, Building2, Mail, LogOut, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  company: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { profile, user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      company: profile?.company || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const { error } = await updateProfile(data);

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setSuccess('Profil mis à jour avec succès');
      setIsLoading(false);
    } catch (err) {
      setError('Une erreur est survenue lors de la mise à jour');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!profile || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      {/* Profile info card */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Informations du compte</h2>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-6">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  onChange={() => {}}
                  className="pl-11 bg-gray-50"
                  placeholder="Email"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                L'email ne peut pas être modifié pour des raisons de sécurité
              </p>
            </div>

            {/* Name */}
            <div>
              <label  className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  
                  type="text"
                  placeholder="Votre nom complet"
                  className="pl-11"
                  {...register('name')}
                  error={errors.name?.message}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Company */}
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

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Account stats */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Statistiques du compte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Membre depuis</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {new Date(profile.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Dernière mise à jour</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {new Date(profile.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
