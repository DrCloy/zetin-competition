/* Repository 레이어 추상화
 * DB와의 연결을 담당하는 Repository 레이어의 추상화
 */

import { Competition, FileItem, Participant } from './model';

export interface CompetitionRepository {
  findAll(): Promise<Competition[]>;
  findById(id: string, detail?: boolean): Promise<Competition | null>;
  findParticipantsById(id: string): Promise<Participant[]>;
  create(competition: Competition): Promise<Competition>;
  update(competition: Competition): Promise<Competition>;
  delete(id: string): Promise<boolean>;
}

export interface FileItemRepositroy {
  getAll(): Promise<FileItem[]>;
  getById(
    id: string,
    detail?: boolean,
    thumbnail?: boolean,
  ): Promise<FileItem | null>;
  create(fileItem: FileItem): Promise<FileItem>;
  update(fileItem: FileItem): Promise<FileItem>;
  delete(id: string): Promise<boolean>;
}

export interface ParticipantRepository {
  findAll(): Promise<Participant[]>;
  findById(id: string): Promise<Participant | null>;
  create(participant: Participant): Promise<Participant>;
  update(participant: Participant): Promise<Participant>;
  delete(id: string): Promise<boolean>;
}
