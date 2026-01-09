export interface Game {
  id: string;
  name: string;
  year: string;
  editor: string;
  players: string;
  duration: string;
  type: string;
  releaseDate: string | null;
  source: 'manual' | 'api';
  createdAt: string;
  updatedAt: string;
}

export type GameFormData = Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'source'>;

export interface GameFilters {
  search: string;
  types: string[];
  sortBy: 'name' | 'year' | 'releaseDate';
  sortOrder: 'asc' | 'desc';
}
