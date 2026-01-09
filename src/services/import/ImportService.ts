import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';

interface ImportData {
  version?: string;
  exportDate?: string;
  influencers: Influencer[];
  games: Game[];
}

class ImportService {
  async importFromJSON(file: File): Promise<ImportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ImportData;

          // Validate data structure
          if (!data.influencers || !Array.isArray(data.influencers)) {
            throw new Error('Format invalide: influencers manquant');
          }

          if (!data.games || !Array.isArray(data.games)) {
            throw new Error('Format invalide: games manquant');
          }

          resolve(data);
        } catch (error) {
          reject(new Error('Erreur lors du parsing JSON: ' + (error as Error).message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };

      reader.readAsText(file);
    });
  }

  validateImportData(data: ImportData): string[] {
    const errors: string[] = [];

    // Validate influencers
    data.influencers.forEach((inf, index) => {
      if (!inf.name || !inf.platform) {
        errors.push(`Influenceur ${index + 1}: nom ou plateforme manquant`);
      }
    });

    // Validate games
    data.games.forEach((game, index) => {
      if (!game.name || !game.editor) {
        errors.push(`Jeu ${index + 1}: nom ou éditeur manquant`);
      }
    });

    return errors;
  }
}

export const importService = new ImportService();
