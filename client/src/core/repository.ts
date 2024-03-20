import { CompetitionItem, CompetitionItemMeta } from './model';

export interface CompetitionListRepository {
  getCompetitions(): Promise<CompetitionItemMeta[]>;
}

export interface CompetitionDetailRepository {
  getCompetition(id: string): Promise<CompetitionItem>;
}

export interface CompetitionFormRepository {
  createCompetition(competition: CompetitionItem): Promise<void>;
  updateCompetition(competition: CompetitionItem): Promise<void>;
  deleteCompetition(id: string): Promise<void>;
}
