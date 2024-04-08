import {
  AuthInput,
  AuthPayload,
  CompetitionItem,
  CompetitionItemMeta,
  FileData,
  FileInput,
  ParticipantInput,
  ParticipantItem,
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

export interface FileRepository {
  getFiles(): Promise<FileData[]>;
  uploadFile(file: FileInput): Promise<FileData>;
  updateFile(file: FileInput): Promise<FileData>;
  deleteFile(id: string): Promise<void>;
}

export interface ParticipantManagementRepository {
  getParticipants(id: string): Promise<ParticipantItem[]>;
  createParticipant(participant: ParticipantInput): Promise<ParticipantItem>;
  updateParticipant(participant: ParticipantInput): Promise<ParticipantItem>;
  deleteParticipant(participantId: string): Promise<void>;
}
