import {
  CompetitionDetailRepository,
  CompetitionListRepository,
} from '../core/repository';
import CompetitionDetailBackendRepo from './competitions/competition-detail-backend';
import CompetitionsBackendRepo from './competitions/competitions-backend';

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

const competitionDetail: CompetitionDetailRepository =
  new CompetitionDetailBackendRepo();

export const repo = { competitionList, competitionDetail };
