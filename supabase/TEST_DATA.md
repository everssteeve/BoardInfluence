# Guide de Création d'Utilisateur de Test

Ce guide explique comment créer un utilisateur de test avec des données d'exemple pour BoardInfluence.

## 📋 Table des matières

- [Méthode 1 : Via l'interface (Recommandé)](#méthode-1--via-linterface-recommandé)
- [Méthode 2 : Ajouter des données à un utilisateur existant](#méthode-2--ajouter-des-données-à-un-utilisateur-existant)
- [Méthode 3 : Script complet (Avancé)](#méthode-3--script-complet-avancé)

---

## Méthode 1 : Via l'interface (Recommandé)

C'est la méthode la plus simple et la plus fiable.

### Étape 1 : Créer l'utilisateur

1. Lancez l'application en développement :
   ```bash
   npm run dev
   ```

2. Allez sur http://localhost:5173

3. Cliquez sur "Inscription" et créez un compte :
   - **Nom** : Utilisateur Test
   - **Email** : test@boardinfluence.com
   - **Entreprise** : Test Company
   - **Mot de passe** : Test123!

4. Vous serez automatiquement connecté

### Étape 2 : Ajouter des données d'exemple

1. Récupérez votre User ID :
   - Allez sur le dashboard Supabase
   - **Authentication** → **Users**
   - Copiez l'UUID de votre utilisateur test

2. Allez dans **SQL Editor** dans Supabase

3. Ouvrez le fichier `supabase/migrations/003b_add_sample_data.sql`

4. **Remplacez** `'YOUR_USER_ID_HERE'` par votre UUID (ligne 13)

5. Copiez tout le script et collez-le dans le SQL Editor

6. Cliquez sur **Run**

7. Vous devriez voir : ✓ Sample data added successfully

8. Actualisez la page de l'application - vous verrez maintenant :
   - **6 jeux** (Catan, Pandemic, Wingspan, 7 Wonders, Azul, Ticket to Ride)
   - **7 influenceurs** (BoardGameGeek TV, Shut Up & Sit Down, etc.)
   - **3 campagnes** (différents statuts : planned, in_progress, completed)

---

## Méthode 2 : Ajouter des données à un utilisateur existant

Si vous avez déjà un compte utilisateur et voulez simplement ajouter des données de test :

1. Connectez-vous à votre compte

2. Récupérez votre User ID depuis le dashboard Supabase (**Authentication** → **Users**)

3. Exécutez le script `003b_add_sample_data.sql` comme décrit dans la Méthode 1, Étape 2

---

## Méthode 3 : Script complet (Avancé)

⚠️ **Attention** : Cette méthode nécessite des permissions avancées sur Supabase et peut ne pas fonctionner sur tous les environnements.

### Prérequis

- Accès complet à la base de données
- Extension `pgcrypto` activée dans Supabase

### Utilisation

1. Allez dans **SQL Editor** sur Supabase

2. Copiez le contenu du fichier `supabase/migrations/003_create_test_user.sql`

3. Collez-le dans l'éditeur SQL

4. Cliquez sur **Run**

5. Si tout fonctionne, vous verrez :
   ```
   Test user created successfully!
   Email: test@boardinfluence.com
   Password: Test123!
   ```

6. Vous pouvez maintenant vous connecter avec ces identifiants

### Limitations

Cette méthode peut ne pas fonctionner si :
- Supabase bloque l'insertion directe dans `auth.users`
- L'extension `pgcrypto` n'est pas disponible
- Vous n'avez pas les permissions suffisantes

Dans ce cas, utilisez la **Méthode 1** (recommandée).

---

## 📊 Données créées

### Jeux (6)
- Catan (1995) - Stratégie
- Pandemic (2008) - Coopératif
- Wingspan (2019) - Stratégie
- 7 Wonders (2010) - Stratégie
- Azul (2017) - Abstrait
- Ticket to Ride (2004) - Famille

### Influenceurs (7)
1. **BoardGameGeek TV** (YouTube, 250K abonnés)
   - Qualité: 5/5, Engagement: 8/10
   - Prix: 500-1000€

2. **Shut Up & Sit Down** (YouTube, 180K abonnés)
   - Qualité: 5/5, Engagement: 9/10
   - Prix: 1000-2000€
   - Statut: Saturé

3. **JeuxSocTV** (Twitch, 45K abonnés)
   - Qualité: 4/5, Engagement: 7/10
   - Prix: 300-500€

4. **Rahdo Runs Through** (YouTube, 95K abonnés)
   - Qualité: 4/5, Engagement: 9/10
   - Prix: 400-800€

5. **Ludovox** (Blog, 30K visiteurs)
   - Qualité: 5/5, Engagement: 6/10
   - Prix: 200-400€

6. **The Dice Tower** (YouTube, 320K abonnés)
   - Qualité: 5/5, Engagement: 7/10
   - Prix: 1500-3000€
   - Statut: Saturé

7. **JeuxDeSociété_FR** (Instagram, 28K abonnés)
   - Qualité: 4/5, Engagement: 8/10
   - Prix: 150-300€

### Campagnes (3)

1. **Lancement Wingspan Extension**
   - Statut: Planifiée
   - Budget: 2500€
   - Jeu: Wingspan

2. **Campagne Pandemic Legacy**
   - Statut: En cours
   - Budget: 1500€
   - Jeu: Pandemic

3. **Catan Championship 2024**
   - Statut: Terminée
   - Budget: 3000€
   - Jeu: Catan

---

## 🧹 Nettoyer les données de test

Pour supprimer toutes les données de test d'un utilisateur :

```sql
-- Remplacez YOUR_USER_ID par l'UUID de l'utilisateur
DELETE FROM public.campaigns WHERE user_id = 'YOUR_USER_ID';
DELETE FROM public.influencers WHERE user_id = 'YOUR_USER_ID';
DELETE FROM public.games WHERE user_id = 'YOUR_USER_ID';
```

Pour supprimer complètement l'utilisateur de test :

```sql
-- Remplacez par l'email de l'utilisateur test
DELETE FROM auth.users WHERE email = 'test@boardinfluence.com';
-- Le profil et toutes les données seront supprimés automatiquement (CASCADE)
```

---

## 🔍 Vérifier les données

Pour vérifier que les données ont été créées :

```sql
-- Compter les éléments par utilisateur
SELECT
  p.name as user_name,
  p.email,
  (SELECT COUNT(*) FROM public.games WHERE user_id = p.id) as games_count,
  (SELECT COUNT(*) FROM public.influencers WHERE user_id = p.id) as influencers_count,
  (SELECT COUNT(*) FROM public.campaigns WHERE user_id = p.id) as campaigns_count
FROM public.profiles p
WHERE p.email = 'test@boardinfluence.com';
```

---

## 💡 Conseils

- **Utilisez la Méthode 1** pour la simplicité et la fiabilité
- Les données de test sont réalistes et basées sur de vrais influenceurs
- Vous pouvez modifier les données d'exemple dans `003b_add_sample_data.sql`
- N'utilisez ces scripts que dans des environnements de développement/test
- Les prix des influenceurs sont indicatifs

---

## ❓ Problèmes courants

### "User does not exist"
→ Créez d'abord l'utilisateur via l'interface (Méthode 1, Étape 1)

### "Permission denied"
→ Vérifiez que les migrations RLS ont été appliquées correctement

### "Duplicate key violation"
→ L'utilisateur existe déjà, utilisez le script de nettoyage ci-dessus

### Les données ne s'affichent pas
→ Actualisez la page de l'application (F5)
→ Vérifiez que vous êtes connecté avec le bon utilisateur
