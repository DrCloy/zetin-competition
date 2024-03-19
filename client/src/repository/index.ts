import { CompetitionRepository } from '../core/repository';
import CompetitionsBackendRepo from './competitions/competitions-backend';

const competitionList: CompetitionRepository = new CompetitionsBackendRepo();

export const repo = { competitionList };
