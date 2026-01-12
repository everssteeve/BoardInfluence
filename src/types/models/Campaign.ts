export type CampaignStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export type DeliverableType = 'video' | 'stream' | 'article' | 'post' | 'review' | 'other';

export interface Deliverable {
  id: string;
  type: DeliverableType;
  description: string;
  url?: string;
  completed: boolean;
  completedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  gameId: string;
  influencerIds: string[];
  status: CampaignStatus;
  budget: number;
  startDate: string;
  endDate?: string;
  objectives: string;
  deliverables: Deliverable[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilters {
  search: string;
  status: CampaignStatus[];
  gameId: string | null;
  sortBy: 'name' | 'startDate' | 'budget' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}
