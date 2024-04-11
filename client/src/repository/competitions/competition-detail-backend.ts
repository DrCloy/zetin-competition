import axios from 'axios';
import { CompetitionEvent, CompetitionItem, ParticipantItem } from 'core/model';
import { CompetitionManagementRepository } from 'core/repository';

export default class CompetitionManagementBackendRepo
  implements CompetitionManagementRepository
{
  async getCompetitionDetail(
    competitionId: string,
    moreDetail: boolean = false,
  ): Promise<CompetitionItem> {
    if (moreDetail) {
      const { data } = await axios.get(
        `/api/competitions/${competitionId}/detail`,
      );

      return {
        id: data._id,
        name: data.name,
        description: data.desc,
        events: data.events.map((event: any) => ({
          id: event._id,
          participants: event.participants.map((participant: any) => {
            if (participant === null) {
              return null;
            } else {
              return {
                participantId: participant._id,
                competitionId: participant.competitionId,
                eventId: participant.eventId,
                name: participant.name,
                email: participant.email,
                team: participant.team,
                robotName: participant.robotName,
                robotCPU: participant.robotCPU,
                robotROM: participant.robotROM,
                robotRAM: participant.robotRAM,
                robotMotorDriver: participant.robotMotorDriver,
                robotMotor: participant.robotMotor,
                robotADC: participant.robotADC,
                robotSensor: participant.robotSensor,
                entryOrder: participant.entryOrder,
                comment: participant.comment,
                privacy: participant.privacyAgreed,
              } as ParticipantItem;
            }
          }),
          name: event.name,
          limit: event.numb,
        })) as CompetitionEvent[],
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
    } else {
      const { data } = await axios.get(`/api/competitions/${competitionId}`);
      return {
        id: data._id,
        name: data.name,
        description: data.desc,
        events: data.events.map((event: any) => ({
          id: event._id,
          participants: event.participants,
          name: event.name,
          limit: event.numb,
        })) as CompetitionEvent[],
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

  async createCompetition(
    competition: CompetitionItem,
  ): Promise<CompetitionItem> {
    try {
      const { data } = await axios.post('/api/competitions', {
        name: competition.name,
        desc: competition.description,
        events: competition.events.map((event) => ({
          _id: event.id,
          participants: new Array(event.limit + 1).fill(null),
          name: event.name,
          desc: '',
          numb: event.limit,
        })),
        date: competition.date.toISOString(),
        regDateStart: competition.regDateStart.toISOString(),
        regDateEnd: competition.regDateEnd.toISOString(),
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
        events: data.events.map((event: any) => ({
          id: event._id,
          participants: event.participants,
          name: event.name,
          limit: event.numb,
        })) as CompetitionEvent[],
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

  async updateCompetition(
    competition: CompetitionItem,
  ): Promise<CompetitionItem> {
    try {
      const { data } = await axios.patch(
        `/api/competitions/${competition.id}`,
        {
          _id: competition.id,
          name: competition.name,
          desc: competition.description,
          events: competition.events.map((event) => ({
            _id: event.id,
            participants:
              event.participants.length >= event.limit
                ? event.participants.slice(0, event.limit + 1)
                : [
                    ...event.participants,
                    ...new Array(
                      event.limit - event.participants.length + 1,
                    ).fill(null),
                  ],

            name: event.name,
            desc: '',
            numb: event.limit,
          })),
          date: competition.date.toISOString(),
          regDateStart: competition.regDateStart.toISOString(),
          regDateEnd: competition.regDateEnd.toISOString(),
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
        events: data.events.map((event: any) => ({
          id: event._id,
          participants: event.participants,
          name: event.name,
          limit: event.numb,
        })) as CompetitionEvent[],
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

  async deleteCompetition(competitionId: string): Promise<void> {
    await axios.delete(`/api/competitions/${competitionId}`);
  }
}
