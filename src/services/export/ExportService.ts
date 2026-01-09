import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';
import { formatDate } from '@/utils/formatters/dateFormatter';

interface ExportData {
  version: string;
  exportDate: string;
  influencers: Influencer[];
  games: Game[];
}

class ExportService {
  exportToJSON(influencers: Influencer[], games: Game[]): void {
    const data: ExportData = {
      version: '3.0.0',
      exportDate: new Date().toISOString(),
      influencers,
      games,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    this.downloadBlob(
      blob,
      `boardinfluence-export-${formatDate(new Date())}.json`
    );
  }

  exportInfluencersToCSV(influencers: Influencer[]): void {
    const headers = [
      'Name',
      'Platform',
      'URL',
      'Subscribers',
      'Engagement',
      'Quality',
      'Specialties',
      'Location',
      'Pricing',
      'Availability',
    ];

    const rows = influencers.map((inf) => [
      inf.name,
      inf.platform,
      inf.url,
      inf.subscribers.toString(),
      inf.engagement.toString(),
      inf.quality.toString(),
      inf.specialties.join('; '),
      inf.location,
      inf.pricing,
      inf.availability,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(
      blob,
      `boardinfluence-influencers-${formatDate(new Date())}.csv`
    );
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();
