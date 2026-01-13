# Supabase Setup Guide

## 📋 Prérequis

- Un compte Supabase (gratuit) : https://app.supabase.com
- Node.js et npm installés

## 🚀 Configuration initiale

### 1. Créer un projet Supabase

1. Allez sur https://app.supabase.com
2. Cliquez sur "New Project"
3. Remplissez les informations :
   - **Name** : BoardInfluence
   - **Database Password** : Choisissez un mot de passe fort
   - **Region** : Choisissez la région la plus proche (ex: Europe West)
4. Cliquez sur "Create new project"
5. Attendez que le projet soit créé (~2 minutes)

### 2. Récupérer les clés API

1. Dans le dashboard Supabase, allez dans **Settings** → **API**
2. Copiez les informations suivantes :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (longue clé commençant par `eyJ...`)

### 3. Configurer les variables d'environnement

1. Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

2. Éditez le fichier `.env` et remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_key_ici
```

### 4. Exécuter les migrations de base de données

#### Migration 1 : Schéma initial

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur "New Query"
3. Copiez le contenu du fichier `supabase/migrations/001_initial_schema.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" pour exécuter la migration

Cette migration va créer :
- Table `profiles` pour les profils utilisateurs
- Table `games` pour les jeux
- Table `influencers` pour les influenceurs
- Table `campaigns` pour les campagnes
- Toutes les policies RLS (Row Level Security) pour l'isolation des données

#### Migration 2 : Création automatique des profils

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Cliquez sur "New Query"
3. Copiez le contenu du fichier `supabase/migrations/002_auto_create_profile.sql`
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" pour exécuter la migration

Cette migration crée un trigger automatique qui :
- Crée automatiquement un profil dans la table `profiles` lors de l'inscription
- Utilise les métadonnées utilisateur (nom, entreprise) pour pré-remplir le profil
- Résout les problèmes de permissions RLS lors de la création de compte

### 5. Configurer l'authentification par email

1. Dans le dashboard Supabase, allez dans **Authentication** → **Settings**
2. Vérifiez que **Enable Email Signup** est activé
3. (Optionnel) Configurez le template d'email de confirmation

## 🔒 Row Level Security (RLS)

La base de données est configurée avec Row Level Security pour garantir que :
- Chaque utilisateur ne peut voir que ses propres données
- Les opérations (SELECT, INSERT, UPDATE, DELETE) sont automatiquement filtrées par `user_id`
- Aucune fuite de données entre utilisateurs n'est possible

Les policies RLS sont déjà configurées dans le script de migration.

## 📊 Vérification de l'installation

Pour vérifier que tout fonctionne :

1. Démarrez l'application en mode développement :

```bash
npm run dev
```

2. Allez sur http://localhost:5173
3. Créez un compte via la page d'inscription
4. Vérifiez que vous êtes redirigé vers le dashboard
5. Dans le dashboard Supabase, allez dans **Authentication** → **Users** pour voir votre utilisateur
6. Dans **Table Editor**, vérifiez que votre profil a été créé dans la table `profiles`

## 🔄 Migration des données localStorage

Si vous avez des données existantes dans localStorage, vous pouvez les migrer :

1. Avant de vous connecter, ouvrez la console du navigateur
2. Exportez vos données en JSON depuis l'interface
3. Connectez-vous avec votre nouveau compte
4. Importez les données via l'interface

## 🛠️ Dépannage

### Erreur : "Missing Supabase environment variables"

- Vérifiez que votre fichier `.env` existe et contient les bonnes valeurs
- Redémarrez le serveur de développement (`npm run dev`)

### Erreur lors de la connexion

- Vérifiez que les migrations SQL ont été exécutées correctement
- Vérifiez que l'authentification par email est activée dans Supabase
- Vérifiez que votre `VITE_SUPABASE_ANON_KEY` est correcte

### Les données ne s'affichent pas

- Vérifiez que les policies RLS sont correctement configurées
- Ouvrez la console du navigateur pour voir les erreurs
- Vérifiez que l'utilisateur est bien connecté (`user_id` est défini)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
