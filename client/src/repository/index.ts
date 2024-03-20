import { CompetitionListRepository } from '../core/repository';
import CompetitionsBackendRepo from './competitions/competitions-backend';

const competitionList: CompetitionListRepository =
  new CompetitionsBackendRepo();

export const repo = { competitionList };
