import { CompetitionItem, CompetitionItemMeta } from './model';

export interface CompetitionListRepository {
  getCompetitions(): Promise<CompetitionItemMeta[]>;
}

export interface CompetitionDetailRepository {
  getCompetitionDetail(id: string): Promise<CompetitionItem>;
}

export interface CompetitionFormRepository {
  createCompetition(competition: CompetitionItem): Promise<void>;
  updateCompetition(competition: CompetitionItem): Promise<void>;
  deleteCompetition(id: string): Promise<void>;
}

export interface MarkdownRenderRepository {
  render(markdown: string): JSX.Element;
}
