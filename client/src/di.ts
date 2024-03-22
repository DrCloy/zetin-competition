// Adapter for Dependency Injection
/* interfaces */
import {
  CompetitionDetailRepository,
  CompetitionListRepository,
} from './core/repository';

/* repositories */
import { MarkdownRender } from './repository/markdown-render/react-markdown-render';
import CompetitionsBackendRepo from 'repository/competitions/competitions-backend';
import CompetitionDetailBackendRepo from 'repository/competitions/competition-detail-backend';

/* depedency injection */

const md = new MarkdownRender();

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

const competitionDetail: CompetitionDetailRepository =
  new CompetitionDetailBackendRepo();

/* export */
export const repo = { competitionList, competitionDetail, md };
