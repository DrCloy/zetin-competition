// Adapter for Dependency Injection
/* interfaces */
import {
  AuthRepository,
  CompetitionManagementRepository,
  CompetitionListRepository,
  FileRepository,
  ParticipantManagementRepository,
} from './core/repository';

/* repositories */
import { MarkdownRender } from './repository/markdown-render/react-markdown-render';
import CompetitionsBackendRepo from 'repository/competitions/competitions-backend';
import CompetitionManagementBackendRepo from 'repository/competitions/competition-detail-backend';
import AuthBackendRepo from 'repository/auth/auth-backend';
import FileManager from 'repository/files/file-manager';
import { ParticipantBackend } from 'repository/participants/participants-backend';

/* depedency injection */
const md = new MarkdownRender();

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

const competitionDetail: CompetitionManagementRepository =
  new CompetitionManagementBackendRepo();

const auth: AuthRepository = new AuthBackendRepo();

const fileManager: FileRepository = new FileManager();

const participantManager: ParticipantManagementRepository =
  new ParticipantBackend();

/* export */
export const repo = {
  competitionList,
  competitionDetail,
  md,
  auth,
  fileManager,
  participantManager,
};
