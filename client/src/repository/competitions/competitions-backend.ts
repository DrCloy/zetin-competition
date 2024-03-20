import axios from 'axios';
import { CompetitionListRepository } from '../../core/repository';

export default class CompetitionsBackendRepo
  implements CompetitionListRepository
{
  async getCompetitions() {
    const { data } = await axios.get('/api/competitions');

    return data.map((competition: any) => ({
      id: competition._id,
      name: competition.name,
      posterId: competition.posterId,
    }));
  }
}
