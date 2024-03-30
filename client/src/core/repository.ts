import {
  AuthInput,
  AuthPayload,
  CompetitionItem,
  CompetitionItemMeta,
} from './model';

export interface CompetitionListRepository {
  getCompetitions(): Promise<CompetitionItemMeta[]>;
}

export interface CompetitionManagementRepository {
  getCompetitionDetail(id: string): Promise<CompetitionItem>;
  createCompetition(competition: CompetitionItem): Promise<CompetitionItem>;
  updateCompetition(competition: CompetitionItem): Promise<CompetitionItem>;
  deleteCompetition(id: string): Promise<void>;
}

export interface MarkdownRenderRepository {
  render(markdown: string): JSX.Element;
}

export interface AuthRepository {
  signin(auth: AuthInput): Promise<AuthPayload>;
  signout(): Promise<void>;
  getStatus(): Promise<AuthPayload>;
}
