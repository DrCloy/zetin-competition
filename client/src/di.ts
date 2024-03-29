// Adapter for Dependency Injection
/* interfaces */
import {
  AuthRepository,
  CompetitionManagementRepository,
  CompetitionListRepository,
} from './core/repository';

/* repositories */
import { MarkdownRender } from './repository/markdown-render/react-markdown-render';
import CompetitionsBackendRepo from 'repository/competitions/competitions-backend';
import CompetitionManagementBackendRepo from 'repository/competitions/competition-detail-backend';
import AuthBackendRepo from 'repository/auth/auth-backend';

/* depedency injection */
const md = new MarkdownRender();

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

const competitionDetail: CompetitionManagementRepository =
  new CompetitionManagementBackendRepo();

const auth: AuthRepository = new AuthBackendRepo();

/* export */
export const repo = { competitionList, competitionDetail, md, auth };
