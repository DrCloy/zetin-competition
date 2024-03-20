import axios from 'axios';
import { CompetitionEvent } from 'core/model';
import { CompetitionDetailRepository } from 'core/repository';

export default class CompetitionDetailBackendRepo
  implements CompetitionDetailRepository
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
}
