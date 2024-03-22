// Dependency Injection
import { MarkdownRender } from '../repository/markdown/markdown-render';
import {
  CompetitionDetailRepository,
  CompetitionListRepository,
} from '../core/repository';
import CompetitionsBackendRepo from 'repository/competitions/competitions-backend';
import CompetitionDetailBackendRepo from 'repository/competitions/competition-detail-backend';

const md = new MarkdownRender();

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

const competitionDetail: CompetitionDetailRepository =
  new CompetitionDetailBackendRepo();

export { md };
export const repo = { competitionList, competitionDetail };
