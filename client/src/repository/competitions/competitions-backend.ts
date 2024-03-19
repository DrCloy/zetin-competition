import axios from 'axios';
import { CompetitionRepository } from '../../core/repository';

export default class CompetitionsBackendRepo implements CompetitionRepository {
  async getCompetitions() {
    const { data } = await axios.get('/api/competitions');

    return data.map((competition: any) => ({
      id: competition._id,
      name: competition.name,
      description: competition.desc,
      events: competition.events,
      regDateStart: new Date(competition.regDateStart),
      regDateEnd: new Date(competition.regDateEnd),
      date: new Date(competition.date),
      place: competition.place,
      googleMap: competition.googleMap,
      organizer: competition.organizer,
      sponser: competition.sponser,
      prize: competition.prize,
      rule: competition.rule,
      moreInfo: competition.moreInfo,
      posterId: competition.posterId,
    }));
  }
}
