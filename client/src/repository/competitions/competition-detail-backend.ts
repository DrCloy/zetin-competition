import axios from 'axios';
import { CompetitionEvent, CompetitionItem } from 'core/model';
import { CompetitionManagementRepository } from 'core/repository';

export default class CompetitionManagementBackendRepo
  implements CompetitionManagementRepository
{
  async getCompetitionDetail(competitionId: string) {
    const { data } = await axios.get(`/api/competitions/${competitionId}`);

    return {
      id: data._id,
      name: data.name,
      description: data.desc,
      events: data.events as CompetitionEvent[],
      regDateStart: new Date(data.regDateStart),
      regDateEnd: new Date(data.regDateEnd),
      date: new Date(data.date),
      place: data.place,
      googleMap: data.googleMap,
      organizer: data.organizer,
      sponser: data.sponser,
      prize: data.prize,
      rule: data.rule,
      moreInfo: data.moreInfo,
      posterId: data.posterId,
    };
  }

  async createCompetition(competition: CompetitionItem) {
    await axios.post('/api/competitions', competition);
  }

  async updateCompetition(competition: CompetitionItem) {
    await axios.put(`/api/competitions/${competition.id}`, competition);
  }

  async deleteCompetition(competitionId: string) {
    await axios.delete(`/api/competitions/${competitionId}`);
  }
}
