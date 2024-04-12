import axios from 'axios';
import { CompetitionListRepository } from '../../core/repository';

export default class CompetitionsBackendRepo
  implements CompetitionListRepository
{
  async getCompetitionList() {
    const { data } = await axios.get('/api/competitions');

    return data.map((competition: any) => ({
      id: competition._id,
      name: competition.name,
      date: new Date(competition.date),
      regDateStart: new Date(competition.regDateStart),
      regDateEnd: new Date(competition.regDateEnd),
      posterId: competition.posterId,
    }));
  }
}
