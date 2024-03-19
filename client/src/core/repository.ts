import { CompetitionItem } from './model';

export interface CompetitionRepository {
  getCompetitions(): Promise<CompetitionItem[]>;
}

export interface CompetitionFormRepository {
  createCompetition(competition: CompetitionItem): Promise<void>;
  updateCompetition(competition: CompetitionItem): Promise<void>;
  deleteCompetition(id: string): Promise<void>;
}
