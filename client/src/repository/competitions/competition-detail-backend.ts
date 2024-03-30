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
    try {
      const { data } = await axios.post('/api/competitions', {
        _id: competition.id,
        name: competition.name,
        desc: competition.description,
        events: competition.events.map((event) => ({
          _id: event.id,
          participants: event.participants,
          name: event.name,
          desc: '',
          numb: event.limit,
        })),
        date: competition.date.toLocaleString(),
        regDateStart: competition.regDateStart.toLocaleString(),
        regDateEnd: competition.regDateEnd.toLocaleString(),
        place: competition.place,
        googleMap: competition.googleMap,
        organizer: competition.organizer,
        sponser: competition.sponser,
        prize: competition.prize,
        rule: competition.rule,
        moreInfo: competition.moreInfo,
        posterId: competition.posterId,
      });

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
    } catch (error) {
      throw error;
    }
  }

  async updateCompetition(competition: CompetitionItem) {
    try {
      const { data } = await axios.patch(
        `/api/competitions/${competition.id}`,
        {
          _id: competition.id,
          name: competition.name,
          desc: competition.description,
          events: competition.events.map((event) => ({
            _id: event.id,
            participants: event.participants,
            name: event.name,
            desc: '',
            numb: event.limit,
          })),
          date: competition.date.toLocaleString(),
          regDateStart: competition.regDateStart.toLocaleString(),
          regDateEnd: competition.regDateEnd.toLocaleString(),
          place: competition.place,
          googleMap: competition.googleMap,
          organizer: competition.organizer,
          sponser: competition.sponser,
          prize: competition.prize,
          rule: competition.rule,
          moreInfo: competition.moreInfo,
          posterId: competition.posterId,
        },
      );

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
    } catch (error) {
      throw error;
    }
  }

  async deleteCompetition(competitionId: string) {
    await axios.delete(`/api/competitions/${competitionId}`);
  }
}
