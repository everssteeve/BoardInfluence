# Intégration YouTube API - Documentation

## Vue d'ensemble

Cette fonctionnalité permet de synchroniser automatiquement les données YouTube pour :
- **Calculer les scores de campagne** basés sur les performances réelles des vidéos
- **Mettre à jour l'engagement rating des influenceurs** avec des données en temps réel
- **Suivre les métriques de performance** (vues, likes, commentaires, engagement rate)

## Configuration

### 1. Obtenir une clé API YouTube

1. Accédez à [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez **YouTube Data API v3** pour votre projet
4. Allez dans : **APIs & Services → Credentials**
5. Créez une nouvelle **API Key**
6. (Recommandé) Restreignez la clé à YouTube Data API v3 uniquement

### 2. Configurer l'application

Ajoutez la clé API dans votre fichier `.env` :

```bash
VITE_YOUTUBE_API_KEY=votre_cle_api_youtube
```

### 3. Appliquer la migration de base de données

Pour ajouter les colonnes nécessaires à la base de données Supabase :

```bash
# Exécutez la migration via Supabase CLI
supabase migration up

# Ou exécutez manuellement le fichier SQL dans l'éditeur SQL de Supabase
# Fichier: supabase/migrations/003_youtube_integration.sql
```

## Utilisation

### Pour les Influenceurs

#### 1. Prérequis
- L'influenceur doit avoir **YouTube** comme plateforme
- L'URL doit être un lien direct vers la chaîne (format: `youtube.com/channel/UCxxx`)

#### 2. Synchronisation

```typescript
import { useYoutubeSync } from '@/hooks/useYoutubeSync';

function InfluencerPage() {
  const { syncInfluencer, isSyncing, error } = useYoutubeSync();

  const handleSync = async () => {
    await syncInfluencer(influencer);
  };

  return (
    <YoutubeSyncButton
      onSync={handleSync}
      disabled={isSyncing}
      lastSyncDate={influencer.lastYoutubeSync}
    />
  );
}
```

#### 3. Données récupérées

Lors de la synchronisation, les métriques suivantes sont automatiquement récupérées :

- **subscriberCount** : Nombre d'abonnés
- **viewCount** : Nombre total de vues
- **videoCount** : Nombre total de vidéos
- **averageViews** : Moyenne de vues par vidéo
- **engagementRate** : Taux d'engagement calculé sur les 10 dernières vidéos

#### 4. Calcul du score

Le score d'un influenceur est automatiquement recalculé en utilisant :

```
Score = subscriberScore (0-50) + engagementScore (0-30) + consistencyScore (0-10) + viewsScore (0-10)

- subscriberScore : min(subscribers / 10000, 50)
- engagementScore : min(engagementRate * 3, 30)
- consistencyScore : min(videoCount / 50, 10)
- viewsScore : min(averageViews / 5000, 10)

Score total : 0-100 points
```

### Pour les Campagnes

#### 1. Prérequis
- La campagne doit avoir des **deliverables complétés** avec des URLs YouTube
- Les URLs doivent pointer vers des vidéos YouTube valides

#### 2. Synchronisation

```typescript
import { useYoutubeSync } from '@/hooks/useYoutubeSync';

function CampaignPage() {
  const { syncCampaign, isSyncing, error } = useYoutubeSync();

  const handleSync = async () => {
    await syncCampaign(campaign);
  };

  return (
    <YoutubeSyncButton
      onSync={handleSync}
      disabled={isSyncing}
      lastSyncDate={campaign.lastYoutubeSync}
    />
  );
}
```

#### 3. Données récupérées

Pour chaque vidéo de la campagne :
- **viewCount** : Nombre de vues
- **likeCount** : Nombre de likes
- **commentCount** : Nombre de commentaires
- **engagementRate** : (likes + comments) / views * 100

Métriques agrégées :
- **totalViews** : Somme des vues de toutes les vidéos
- **totalLikes** : Somme des likes
- **totalComments** : Somme des commentaires
- **averageEngagementRate** : Taux d'engagement moyen
- **estimatedReach** : Portée estimée (70% des vues totales)
- **performanceScore** : Score calculé (0-100)

#### 4. Calcul du score de campagne

```
Score = viewsScore (0-40) + engagementScore (0-30) + reachScore (0-20) + interactionScore (0-10)

- viewsScore : Efficacité par rapport au budget
- engagementScore : Basé sur le taux d'engagement moyen
- reachScore : Basé sur le nombre de vidéos et la portée totale
- interactionScore : Basé sur le ratio likes + commentaires

Score total : 0-100 points
```

## Architecture

### Services

```
src/services/youtube/
├── youtubeService.ts       # API YouTube (bas niveau)
└── youtubeSyncService.ts   # Orchestration de la synchronisation
```

**youtubeService.ts** - Appels directs à l'API YouTube :
- `fetchChannelMetrics(channelId)` : Récupère les stats d'une chaîne
- `fetchVideoMetrics(videoId)` : Récupère les stats d'une vidéo
- `fetchMultipleVideoMetrics(videoIds[])` : Récupère les stats de plusieurs vidéos
- `extractChannelId(url)` : Extrait l'ID de chaîne depuis une URL
- `extractVideoId(url)` : Extrait l'ID de vidéo depuis une URL

**youtubeSyncService.ts** - Logique métier :
- `syncInfluencerYoutubeMetrics(influencer)` : Synchronise un influenceur
- `syncCampaignYoutubeMetrics(campaign)` : Synchronise une campagne
- `syncMultipleInfluencers(influencers[])` : Synchronisation en batch
- `syncMultipleCampaigns(campaigns[])` : Synchronisation en batch
- `needsYoutubeSync(entity, maxAgeDays)` : Vérifie si une sync est nécessaire

### Helpers de calcul

```
src/utils/helpers/scoreHelpers.ts
```

- `calculateYoutubeInfluencerScore(influencer)` : Calcule le score d'un influenceur
- `calculateCampaignScore(campaign, videoMetrics[])` : Calcule le score d'une campagne
- `calculateCampaignMetrics(videoMetrics[])` : Agrège les métriques de campagne
- `getCampaignScoreClass(score)` : Retourne la classe CSS pour le score
- `getCampaignScoreLabel(score)` : Retourne le label du score (Faible/Moyen/Excellent)

### Types TypeScript

```typescript
// src/types/youtube.ts

interface YoutubeChannelMetrics {
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  averageViews: number;
  engagementRate: number;
  lastUpdated: string;
}

interface YoutubeVideoMetrics {
  videoId: string;
  videoUrl: string;
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  engagementRate: number;
}

interface YoutubeCampaignMetrics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalVideos: number;
  averageEngagementRate: number;
  estimatedReach: number;
  performanceScore: number;
  lastUpdated: string;
}
```

### Composants UI

```
src/components/common/
├── YoutubeSyncButton.tsx    # Bouton de synchronisation
└── YoutubeMetricsCard.tsx   # Carte d'affichage des métriques
```

**YoutubeSyncButton** - Bouton avec états :
- Idle : "Synchroniser YouTube"
- Syncing : "Synchronisation..." (icône animée)
- Success : "Synchronisé !" (3 secondes)
- Error : "Erreur" (5 secondes)

**YoutubeMetricsCard** - Affichage des métriques :
- Format "channel" : Abonnés, vues, engagement
- Format "campaign" : Vues, likes, commentaires, score de performance

### Hook personnalisé

```
src/hooks/useYoutubeSync.ts
```

Gère la logique de synchronisation avec le store Zustand et Supabase.

## Base de données

### Nouvelles colonnes

**Table `influencers`** :
```sql
youtube_channel_id       TEXT             -- ID de la chaîne YouTube
youtube_metrics          JSONB            -- Métriques de la chaîne
last_youtube_sync        TIMESTAMP        -- Date de dernière sync
```

**Table `campaigns`** :
```sql
performance_score        INTEGER          -- Score de performance (0-100)
youtube_metrics          JSONB            -- Métriques agrégées
last_youtube_sync        TIMESTAMP        -- Date de dernière sync
```

### Index créés

- `idx_influencers_youtube_channel_id` : Recherche rapide par channel ID
- `idx_influencers_last_youtube_sync` : Tri par date de sync
- `idx_campaigns_last_youtube_sync` : Tri par date de sync
- `idx_campaigns_performance_score` : Tri par score de performance

## Limites et bonnes pratiques

### Limites de l'API YouTube

- **Quota quotidien** : 10,000 unités par jour (gratuit)
- **Coût par requête** :
  - Récupération de stats de chaîne : 1 unité
  - Récupération de stats de vidéo : 1 unité
  - Recherche de vidéos : 100 unités

### Recommandations

1. **Limitez les synchronisations** : Ne synchronisez que lorsque nécessaire
2. **Utilisez la détection de staleness** : `needsYoutubeSync(entity, 7)` pour éviter les syncs répétées
3. **Batch processing** : Utilisez `syncMultipleInfluencers()` avec un délai entre les requêtes (500ms par défaut)
4. **Gestion d'erreurs** : Affichez les erreurs à l'utilisateur et permettez de réessayer

### Exemple de gestion du quota

```typescript
// Synchroniser uniquement les entités qui nécessitent une mise à jour
const influencersToSync = influencers.filter(i => needsYoutubeSync(i, 7));

if (influencersToSync.length > 0) {
  await syncMultipleInfluencers(influencersToSync, (current, total) => {
    console.log(`Sync ${current}/${total}`);
  });
}
```

## Dépannage

### Erreur : "YouTube API key not configured"

**Solution** : Vérifiez que `VITE_YOUTUBE_API_KEY` est défini dans `.env`

### Erreur : "Could not extract YouTube channel ID"

**Solution** : Utilisez un lien direct vers la chaîne au format :
- ✅ `https://www.youtube.com/channel/UCxxxxxxxxxxx`
- ❌ `https://www.youtube.com/@username` (non supporté actuellement)

### Erreur : "No completed YouTube videos found"

**Solution** :
1. Assurez-vous que des deliverables sont marqués comme "complétés"
2. Vérifiez que les URLs des deliverables contiennent des liens YouTube valides

### Quota API dépassé

**Solution** :
1. Attendez le reset quotidien (minuit PST)
2. Ou activez la facturation sur Google Cloud pour augmenter le quota

## Évolutions futures

- [ ] Support des URLs `@username` via l'API de recherche
- [ ] Synchronisation automatique programmée (cron job)
- [ ] Dashboard de monitoring du quota API
- [ ] Export des métriques en CSV/PDF
- [ ] Comparaison de campagnes
- [ ] Prédiction de performance basée sur l'historique
