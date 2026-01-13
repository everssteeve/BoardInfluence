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

⚠️ **IMPORTANT** : Cette étape est **OBLIGATOIRE** pour que l'application fonctionne en production.

Pour que le workflow GitHub Actions fonctionne correctement, vous devez configurer les secrets suivants dans votre repository :

### Étapes détaillées :

1. **Récupérez vos identifiants Supabase** :
   - Allez sur https://app.supabase.com
   - Sélectionnez votre projet BoardInfluence
   - Allez dans **Settings** → **API**
   - Copiez la **Project URL** (exemple: `https://hdkxoilanexazvctckee.supabase.co`)
   - Copiez la **anon/public key** (c'est une longue clé JWT qui commence par `eyJ...`)

2. **Configurez les secrets GitHub** :
   - Allez sur https://github.com/everssteeve/BoardInfluence/settings/secrets/actions
   - Cliquez sur **"New repository secret"**
   - Ajoutez le premier secret :
     - Name: `VITE_SUPABASE_URL`
     - Secret: Collez votre Project URL (exemple: `https://hdkxoilanexazvctckee.supabase.co`)
     - Cliquez sur **"Add secret"**
   - Ajoutez le deuxième secret :
     - Name: `VITE_SUPABASE_ANON_KEY`
     - Secret: Collez votre anon/public key (la longue clé JWT)
     - Cliquez sur **"Add secret"**

3. **Redéployez l'application** :
   - Après avoir configuré les secrets, déclenchez un nouveau déploiement
   - Option 1: Faites un push vers la branche `main`
   - Option 2: Allez dans l'onglet **Actions** et relancez manuellement le workflow "Build and Deploy to GitHub Pages"

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

## Dépannage (Troubleshooting)

### Erreur: "Missing Supabase environment variables" en production

**Symptôme** : L'application affiche une erreur au chargement : `Uncaught Error: Missing Supabase environment variables`

**Cause** : Les secrets GitHub ne sont pas configurés ou sont vides

**Solution** :
1. Vérifiez que les secrets sont bien configurés dans GitHub :
   - Allez sur https://github.com/everssteeve/BoardInfluence/settings/secrets/actions
   - Vérifiez que `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` existent
   - Si non, suivez les instructions de la section "Configuration des secrets GitHub" ci-dessus

2. Si les secrets existent mais l'erreur persiste :
   - Vérifiez que les valeurs ne sont pas vides
   - Supprimez les secrets existants et recréez-les
   - Assurez-vous de copier la clé complète (la clé JWT est très longue, plusieurs centaines de caractères)

3. Relancez le déploiement :
   - Allez dans l'onglet **Actions** sur GitHub
   - Cliquez sur le workflow "Build and Deploy to GitHub Pages"
   - Cliquez sur **"Run workflow"** pour forcer un nouveau build

4. Vérifiez les logs du workflow :
   - Le nouveau workflow inclut une étape "Validate Environment Variables"
   - Cette étape affichera un message clair si les secrets sont manquants
   - Si les secrets sont présents, vous verrez : "✅ All required secrets are set"

### Erreur: Échec du workflow GitHub Actions

**Symptôme** : Le workflow "Build and Deploy to GitHub Pages" échoue

**Solution** :
- Consultez les logs du workflow dans l'onglet Actions
- Cherchez l'étape "Validate Environment Variables"
- Suivez les instructions affichées dans les logs
