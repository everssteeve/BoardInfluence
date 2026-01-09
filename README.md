# 🎲 BoardInfluence v3.0

> Application professionnelle de gestion d'influenceurs pour éditeurs de jeux de société

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Caractéristiques

- 🎯 **Architecture Modulaire** - Structure professionnelle et maintenable
- 🚀 **Performance Optimale** - Build Vite ultra-rapide
- 💾 **Gestion d'État** - Zustand avec persistence localStorage
- 🎨 **UI Moderne** - Tailwind CSS + Radix UI
- 📝 **TypeScript** - Type-safe à 100%
- 🧪 **Tests** - Vitest + Testing Library
- 📦 **Export/Import** - JSON et CSV
- 🔍 **Recherche Avancée** - Filtres multi-critères
- 📊 **Dashboard** - Statistiques et analytics

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
src/
├── app/                 # Configuration app
├── assets/             # Styles & assets
│   └── styles/         # CSS global
├── components/          # Composants UI
│   ├── common/         # Composants réutilisables
│   ├── layout/         # Layout components
│   └── domain/         # Business components
├── features/           # Features par domaine
│   ├── dashboard/      # Dashboard feature
│   ├── games/          # Gestion des jeux
│   ├── influencers/    # Gestion des influenceurs
│   ├── search/         # Recherche globale
│   ├── onboarding/     # Onboarding
│   └── import/         # Import de données
├── store/              # State management (Zustand)
│   └── slices/         # Store slices
├── services/           # Services & API
│   ├── storage/        # LocalStorage
│   ├── export/         # Export JSON/CSV
│   └── import/         # Import données
├── hooks/              # Custom hooks
├── utils/              # Utilitaires
│   ├── constants/      # Constantes
│   ├── formatters/     # Formateurs
│   ├── helpers/        # Helpers
│   └── validators/     # Validateurs
└── types/              # TypeScript types
    ├── models/         # Domain models
    ├── api/            # API types
    └── ui/             # UI types
```

## 🛠️ Stack Technique

### Core
- **Framework:** React 18
- **Language:** TypeScript 5.3
- **Build Tool:** Vite 5.0
- **Package Manager:** npm

### State & Data
- **State Management:** Zustand 4.4
- **Data Fetching:** TanStack Query 5.0
- **Storage:** LocalStorage avec persistence
- **Validation:** Zod 3.22

### UI & Styling
- **CSS Framework:** Tailwind CSS 3.4
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Animations:** CSS custom animations

### Forms & Validation
- **Form Library:** React Hook Form 7.48
- **Schema Validation:** Zod
- **Resolvers:** @hookform/resolvers

### Utils
- **Date Handling:** date-fns 2.30
- **Class Names:** clsx
- **Utilities:** lodash-es

### Development
- **Linting:** ESLint 8.55
- **Formatting:** Prettier 3.1
- **Testing:** Vitest 1.0 + Testing Library
- **Type Checking:** TypeScript strict mode

### CI/CD
- **Actions:** GitHub Actions
- **Deployment:** GitHub Pages
- **Coverage:** Codecov

## 📋 Scripts Disponibles

```bash
# Développement
npm run dev              # Lance le serveur de dev
npm run build            # Build de production
npm run preview          # Preview du build

# Qualité du code
npm run lint             # Lance ESLint
npm run lint:fix         # Fix automatique ESLint
npm run format           # Format avec Prettier
npm run format:check     # Vérifie le formatage
npm run type-check       # Vérifie les types TypeScript

# Tests
npm run test             # Lance les tests
npm run test:ui          # Lance l'UI des tests
npm run test:coverage    # Génère le coverage
npm run test:watch       # Mode watch
```

## 🎯 Fonctionnalités Principales

### 📊 Dashboard
- Vue d'ensemble des statistiques
- Top influenceurs
- Actions rapides
- État vide avec onboarding

### 🎮 Gestion des Jeux
- CRUD complet
- Recherche et filtres
- Types de jeux
- Dates de sortie

### 👥 Gestion des Influenceurs
- CRUD complet
- Profils détaillés
- Spécialités multiples
- Score d'influence calculé
- Pricing et disponibilité
- Multi-plateforme (YouTube, Twitch, Blog, etc.)
- Localisation géographique

### 🔍 Recherche Avancée
- Recherche globale
- Filtres multi-critères
- Tri personnalisable
- Recherche temps réel

### 📤 Export/Import
- Export JSON complet
- Export CSV influenceurs
- Import JSON avec validation
- Migration de données automatique

## 🎨 Design System

### Couleurs
- **Primary:** Orange (#FF6B35) - Actions principales
- **Secondary:** Bleu (#004E89) - Informations
- **Accent:** Jaune (#F7B801) - Highlights
- **Success:** Vert (#06D6A0) - Succès
- **Danger:** Rouge (#EF476F) - Erreurs/Alertes

### Typographie
- **Sans:** Bricolage Grotesque
- **Mono:** Space Mono

### Animations
- slide-down, slide-up, slide-in-left, fade-in
- Transitions smooth sur hover
- Micro-interactions

## 🧪 Tests

```bash
# Lancer tous les tests
npm run test

# Mode watch
npm run test:watch

# UI des tests
npm run test:ui

# Coverage
npm run test:coverage
```

Les tests couvrent :
- Composants UI
- Hooks personnalisés
- Services (Storage, Export)
- Utilitaires et helpers
- Slices du store

## 🚢 Déploiement

### Production Build
```bash
npm run build
```

Le build est optimisé avec :
- Code splitting automatique
- Tree shaking
- Minification
- Source maps
- Chunk optimization

### GitHub Pages
Le déploiement sur GitHub Pages se fait automatiquement via GitHub Actions lors d'un push sur `main`.

## 📚 Architecture & Patterns

### State Management
- **Zustand** pour le state global
- Slices séparés par domaine
- Persistence localStorage automatique
- Actions typées

### Component Architecture
- Composants fonctionnels
- Hooks personnalisés
- Props typées strictement
- Composition over inheritance

### File Organization
- Feature-based structure
- Co-location des fichiers liés
- Index files pour exports propres
- Types séparés des composants

### Code Quality
- TypeScript strict mode
- ESLint avec règles strictes
- Prettier pour le formatage
- Hooks rules enforcement

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines
- Suivre les conventions de code existantes
- Ajouter des tests pour les nouvelles features
- Mettre à jour la documentation si nécessaire
- Respecter le formatage Prettier/ESLint

## 📝 Roadmap

### v3.1 - Q1 2026
- [ ] Authentification utilisateur
- [ ] Base de données cloud (Firebase/Supabase)
- [ ] Collaboration multi-utilisateur
- [ ] Notifications en temps réel

### v3.2 - Q2 2026
- [ ] API publique BoardGameGeek
- [ ] API YouTube/Twitch pour stats auto
- [ ] Analytics avancés
- [ ] Rapports PDF

### v3.3 - Q3 2026
- [ ] Mode hors-ligne complet
- [ ] App mobile (React Native)
- [ ] Intégration CRM
- [ ] Automatisation emails

## 📄 Licence

MIT © 2026 BoardInfluence

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Radix UI](https://www.radix-ui.com/)
- La communauté open-source

---

**Fait avec ❤️ pour la communauté des jeux de société**
