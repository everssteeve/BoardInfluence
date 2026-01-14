import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Game } from '../../types/models/Game';
import type { Influencer } from '../../types/models/Influencer';
import type { Campaign } from '../../types/models/Campaign';
import { formatCurrency } from '../../utils/formatters/numberFormatter';
import { formatDate } from '../../utils/formatters/dateFormatter';
import { calculateInfluenceScore } from '../../utils/helpers/scoreHelpers';

export class ReportService {
  private static addHeader(doc: jsPDF, title: string) {
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 53); // Orange brand color
    doc.text(title, 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${formatDate(new Date())}`, 14, 30);

    // Add logo/brand text
    doc.setFontSize(12);
    doc.setTextColor(0, 78, 137); // Blue brand color
    doc.text('🎲 BoardInfluence', doc.internal.pageSize.getWidth() - 50, 22);

    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, doc.internal.pageSize.getWidth() - 14, 35);
  }

  private static addFooter(doc: jsPDF) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  }

  // Campaign Performance Report
  static generateCampaignReport(campaigns: Campaign[], games: Game[], _influencers: Influencer[]): void {
    const doc = new jsPDF();

    this.addHeader(doc, 'Rapport de Performance des Campagnes');

    // Summary stats
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'in_progress').length;
    const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
    const avgCompletion = campaigns.length > 0
      ? campaigns.reduce((sum, c) => {
          const completed = c.deliverables.filter(d => d.completed).length;
          return sum + (completed / c.deliverables.length || 0);
        }, 0) / campaigns.length * 100
      : 0;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Vue d\'ensemble', 14, 45);

    doc.setFontSize(10);
    const summaryData = [
      ['Total Campagnes', campaigns.length.toString()],
      ['Campagnes Actives', activeCampaigns.toString()],
      ['Campagnes Terminées', completedCampaigns.toString()],
      ['Budget Total', formatCurrency(totalBudget)],
      ['Complétion Moyenne', `${avgCompletion.toFixed(1)}%`]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Métrique', 'Valeur']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 53] }
    });

    // Campaign details table
    const campaignData = campaigns.map(campaign => {
      const game = games.find(g => g.id === campaign.gameId);
      const completed = campaign.deliverables.filter(d => d.completed).length;
      const completionRate = campaign.deliverables.length > 0
        ? (completed / campaign.deliverables.length * 100).toFixed(0)
        : '0';

      return [
        campaign.name,
        game?.name || 'N/A',
        campaign.status,
        formatCurrency(campaign.budget),
        `${completed}/${campaign.deliverables.length}`,
        `${completionRate}%`
      ];
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Campagne', 'Jeu', 'Statut', 'Budget', 'Livrables', 'Complétion']],
      body: campaignData,
      theme: 'striped',
      headStyles: { fillColor: [0, 78, 137] }
    });

    this.addFooter(doc);
    doc.save('campaign-report.pdf');
  }

  // Influencer Summary Report
  static generateInfluencerReport(influencers: Influencer[], campaigns: Campaign[]): void {
    const doc = new jsPDF();

    this.addHeader(doc, 'Rapport Récapitulatif des Influenceurs');

    // Summary stats
    const totalInfluencers = influencers.length;
    const availableInfluencers = influencers.filter(i => i.availability === 'Disponible').length;
    const avgScore = influencers.length > 0
      ? influencers.reduce((sum, i) => sum + calculateInfluenceScore(i), 0) / influencers.length
      : 0;
    const topPlatform = this.getMostCommonPlatform(influencers);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Vue d\'ensemble', 14, 45);

    doc.setFontSize(10);
    const summaryData = [
      ['Total Influenceurs', totalInfluencers.toString()],
      ['Influenceurs Disponibles', availableInfluencers.toString()],
      ['Score d\'Influence Moyen', avgScore.toFixed(1)],
      ['Plateforme la Plus Populaire', topPlatform]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Métrique', 'Valeur']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 53] }
    });

    // Top performers
    const topInfluencers = [...influencers]
      .sort((a, b) => calculateInfluenceScore(b) - calculateInfluenceScore(a))
      .slice(0, 10);

    const influencerData = topInfluencers.map(influencer => {
      const score = calculateInfluenceScore(influencer);
      const campaignCount = campaigns.filter(c =>
        c.influencerIds.includes(influencer.id)
      ).length;

      return [
        influencer.name,
        influencer.platform,
        influencer.subscribers.toLocaleString(),
        score.toFixed(1),
        campaignCount.toString(),
        influencer.availability
      ];
    });

    doc.setFontSize(12);
    doc.text('Top 10 Influenceurs par Score', 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Nom', 'Plateforme', 'Abonnés', 'Score', 'Campagnes', 'Disponibilité']],
      body: influencerData,
      theme: 'striped',
      headStyles: { fillColor: [0, 78, 137] }
    });

    this.addFooter(doc);
    doc.save('influencer-report.pdf');
  }

  // Detailed Campaign Report (single campaign)
  static generateDetailedCampaignReport(
    campaign: Campaign,
    game: Game | undefined,
    influencers: Influencer[]
  ): void {
    const doc = new jsPDF();

    this.addHeader(doc, `Campagne: ${campaign.name}`);

    // Campaign info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Détails de la Campagne', 14, 45);

    const infoData = [
      ['Jeu', game?.name || 'N/A'],
      ['Statut', campaign.status],
      ['Budget', formatCurrency(campaign.budget)],
      ['Date de Début', formatDate(campaign.startDate)],
      ['Date de Fin', campaign.endDate ? formatDate(campaign.endDate) : 'N/A'],
      ['Objectifs', campaign.objectives || 'N/A']
    ];

    autoTable(doc, {
      startY: 50,
      body: infoData,
      theme: 'plain',
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 140 }
      }
    });

    // Influencers
    doc.setFontSize(12);
    doc.text('Influenceurs Assignés', 14, (doc as any).lastAutoTable.finalY + 15);

    const campaignInfluencers = influencers.filter(i =>
      campaign.influencerIds.includes(i.id)
    );

    const influencerData = campaignInfluencers.map(inf => [
      inf.name,
      inf.platform,
      inf.subscribers.toLocaleString(),
      calculateInfluenceScore(inf).toFixed(1)
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Nom', 'Plateforme', 'Abonnés', 'Score']],
      body: influencerData.length > 0 ? influencerData : [['Aucun influenceur assigné', '', '', '']],
      theme: 'striped',
      headStyles: { fillColor: [0, 78, 137] }
    });

    // Deliverables
    doc.setFontSize(12);
    doc.text('Livrables', 14, (doc as any).lastAutoTable.finalY + 15);

    const deliverableData = campaign.deliverables.map(del => [
      del.type,
      del.description,
      del.completed ? '✓ Terminé' : '○ En Attente'
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Type', 'Description', 'Statut']],
      body: deliverableData.length > 0 ? deliverableData : [['Aucun livrable', '', '']],
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 53] },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 120 },
        2: { cellWidth: 35 }
      }
    });

    // Completion stats
    const completed = campaign.deliverables.filter(d => d.completed).length;
    const total = campaign.deliverables.length;
    const completionRate = total > 0 ? (completed / total * 100).toFixed(0) : '0';

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Taux de Complétion: ${completionRate}% (${completed}/${total} livrables)`,
      14,
      (doc as any).lastAutoTable.finalY + 10
    );

    this.addFooter(doc);
    doc.save(`campaign-${campaign.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  }

  // Budget Analysis Report
  static generateBudgetReport(campaigns: Campaign[], games: Game[]): void {
    const doc = new jsPDF();

    this.addHeader(doc, 'Rapport d\'Analyse Budgétaire');

    // Budget by status
    const budgetByStatus = {
      planned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };

    campaigns.forEach(c => {
      budgetByStatus[c.status] += c.budget;
    });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Budget par Statut de Campagne', 14, 45);

    const statusData = Object.entries(budgetByStatus).map(([status, budget]) => [
      status,
      formatCurrency(budget),
      campaigns.filter(c => c.status === status).length.toString()
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Statut', 'Budget Total', 'Nombre de Campagnes']],
      body: statusData,
      theme: 'striped',
      headStyles: { fillColor: [255, 107, 53] }
    });

    // Budget by game
    const budgetByGame: Record<string, { budget: number; count: number }> = {};

    campaigns.forEach(c => {
      const game = games.find(g => g.id === c.gameId);
      const gameName = game?.name || 'Jeu Inconnu';

      if (!budgetByGame[gameName]) {
        budgetByGame[gameName] = { budget: 0, count: 0 };
      }

      budgetByGame[gameName].budget += c.budget;
      budgetByGame[gameName].count += 1;
    });

    const gameData = Object.entries(budgetByGame)
      .sort((a, b) => b[1].budget - a[1].budget)
      .map(([name, data]) => [
        name,
        formatCurrency(data.budget),
        data.count.toString(),
        formatCurrency(data.budget / data.count)
      ]);

    doc.setFontSize(12);
    doc.text('Budget par Jeu', 14, (doc as any).lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Jeu', 'Budget Total', 'Campagnes', 'Moyenne par Campagne']],
      body: gameData,
      theme: 'striped',
      headStyles: { fillColor: [0, 78, 137] }
    });

    // Total summary
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const completedBudget = budgetByStatus.completed;
    const activeBudget = budgetByStatus.in_progress;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const summaryY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Budget Total: ${formatCurrency(totalBudget)}`, 14, summaryY);
    doc.text(`Campagnes Terminées: ${formatCurrency(completedBudget)}`, 14, summaryY + 6);
    doc.text(`Campagnes Actives: ${formatCurrency(activeBudget)}`, 14, summaryY + 12);

    this.addFooter(doc);
    doc.save('budget-analysis.pdf');
  }

  // Helper method
  private static getMostCommonPlatform(influencers: Influencer[]): string {
    const platformCount: Record<string, number> = {};

    influencers.forEach(inf => {
      platformCount[inf.platform] = (platformCount[inf.platform] || 0) + 1;
    });

    const entries = Object.entries(platformCount);
    if (entries.length === 0) return 'N/A';

    return entries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];
  }
}
