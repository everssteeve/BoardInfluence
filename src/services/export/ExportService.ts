import { Game } from '@/types/models/Game';
import { Influencer } from '@/types/models/Influencer';
import { Campaign } from '@/types/models/Campaign';
import { formatDate } from '@/utils/formatters/dateFormatter';

interface ExportData {
  version: string;
  exportDate: string;
  influencers: Influencer[];
  games: Game[];
  campaigns: Campaign[];
}

class ExportService {
  exportJSON(games: Game[], influencers: Influencer[], campaigns: Campaign[] = []): void {
    const data: ExportData = {
      version: '3.0.0',
      exportDate: new Date().toISOString(),
      influencers,
      games,
      campaigns,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    this.downloadBlob(
      blob,
      `boardinfluence-export-${formatDate(new Date())}.json`
    );
  }

  exportCSV(influencers: Influencer[]): void {
    this.exportInfluencersToCSV(influencers);
  }

  exportToJSON(influencers: Influencer[], games: Game[], campaigns: Campaign[] = []): void {
    this.exportJSON(games, influencers, campaigns);
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

  exportCampaignsToCSV(campaigns: Campaign[], games: Game[], influencers: Influencer[]): void {
    const headers = [
      'Name',
      'Status',
      'Game',
      'Influencers',
      'Budget',
      'Start Date',
      'End Date',
      'Objectives',
      'Deliverables Total',
      'Deliverables Completed',
      'Completion Rate',
      'Notes',
    ];

    const gameMap = new Map(games.map((g) => [g.id, g.name]));
    const influencerMap = new Map(influencers.map((i) => [i.id, i.name]));

    const rows = campaigns.map((campaign) => {
      const gameName = gameMap.get(campaign.gameId) || 'N/A';
      const influencerNames = campaign.influencerIds
        .map((id) => influencerMap.get(id))
        .filter(Boolean)
        .join('; ');
      const completedDeliverables = campaign.deliverables.filter((d) => d.completed).length;
      const totalDeliverables = campaign.deliverables.length;
      const completionRate = totalDeliverables > 0
        ? `${Math.round((completedDeliverables / totalDeliverables) * 100)}%`
        : '0%';

      return [
        campaign.name,
        campaign.status,
        gameName,
        influencerNames || 'N/A',
        campaign.budget.toString() + '€',
        campaign.startDate,
        campaign.endDate || 'N/A',
        campaign.objectives,
        totalDeliverables.toString(),
        completedDeliverables.toString(),
        completionRate,
        campaign.notes || '',
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(
      blob,
      `boardinfluence-campaigns-${formatDate(new Date())}.csv`
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
