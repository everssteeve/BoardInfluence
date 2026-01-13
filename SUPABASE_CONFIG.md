# Configuration Supabase pour la réinitialisation de mot de passe

## Problème résolu
La fonctionnalité de réinitialisation de mot de passe échouait car l'URL de redirection pointait vers `localhost:3000` au lieu de l'URL de production.

## Solution implémentée

### 1. Variable d'environnement ajoutée
- Ajout de `VITE_APP_URL` dans `.env` et `.env.example`
- Cette variable définit l'URL de base de l'application
- Production: `https://everssteeve.github.io/BoardInfluence`
- Développement local: `http://localhost:3000/BoardInfluence`

### 2. Code mis à jour
- Modification de `src/services/auth/authService.ts`
- La méthode `requestPasswordReset` utilise maintenant `VITE_APP_URL` au lieu de `window.location.origin`
- L'URL de redirection est maintenant: `${VITE_APP_URL}/reset-password`

### 3. Workflow GitHub Actions mis à jour
- Ajout de `VITE_APP_URL` dans le step de build du workflow `deploy.yml`
- Ajout des secrets Supabase pour le build de production

## Configuration requise dans Supabase

Pour que la réinitialisation de mot de passe fonctionne correctement, vous devez configurer les URLs autorisées dans Supabase :

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet BoardInfluence
3. Allez dans **Authentication** → **URL Configuration**
4. Dans la section **Redirect URLs**, ajoutez les URLs suivantes :
   - `https://everssteeve.github.io/BoardInfluence/reset-password`
   - `http://localhost:3000/BoardInfluence/reset-password` (pour le développement local)

5. Cliquez sur **Save** pour enregistrer les modifications

## Configuration des secrets GitHub

Pour que le workflow GitHub Actions fonctionne correctement, vous devez configurer les secrets suivants dans votre repository :

1. Allez sur https://github.com/everssteeve/BoardInfluence/settings/secrets/actions
2. Ajoutez les secrets suivants :
   - `VITE_SUPABASE_URL` : L'URL de votre projet Supabase (https://hdkxoilanexazvctckee.supabase.co)
   - `VITE_SUPABASE_ANON_KEY` : La clé anonyme de votre projet Supabase

## Test de la fonctionnalité

1. **En développement local** :
   - Assurez-vous que `.env` contient `VITE_APP_URL=http://localhost:3000/BoardInfluence`
   - Démarrez l'application avec `npm run dev`
   - Testez la réinitialisation de mot de passe
   - Vérifiez que l'email contient un lien vers `http://localhost:3000/BoardInfluence/reset-password`

2. **En production** :
   - Poussez les modifications vers la branche `main`
   - Le workflow GitHub Actions déploiera automatiquement
   - Testez la réinitialisation de mot de passe
   - Vérifiez que l'email contient un lien vers `https://everssteeve.github.io/BoardInfluence/reset-password`

## Remarques importantes

- Les URLs de redirection doivent correspondre exactement à celles configurées dans Supabase
- Si vous changez l'URL de production, mettez à jour :
  1. La variable `VITE_APP_URL` dans `.env.example`
  2. La variable `VITE_APP_URL` dans `.github/workflows/deploy.yml`
  3. Les Redirect URLs dans Supabase
