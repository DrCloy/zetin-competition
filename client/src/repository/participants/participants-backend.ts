import axios from 'axios';
import {
  CompetitionEvent,
  ParticipantInput,
  ParticipantItem,
} from 'core/model';
import { ParticipantManagementRepository } from 'core/repository';

export class ParticipantBackend implements ParticipantManagementRepository {
  async getParticipants(competitionId: string): Promise<CompetitionEvent[]> {
    const { data } = await axios.get(
      `/api/competitions/${competitionId}?projection=events`,
    );

    return data.events.map((item: any) => ({
      id: item._id,
      name: item.name,
      participants: item.participants,
      limit: item.numb,
    }));
  }

  async getAllParticipants(
    competitionId: string,
    dateSort: string = 'desc',
  ): Promise<ParticipantItem[]> {
    const { data } = await axios.get(
      `/api/competitions/${competitionId}/participants?dateSort=${dateSort}`,
    );

    return data.map((item: any) => ({
      participantId: item._id,
      competitionId: item.competitionId,
      eventId: item.eventId,
      name: item.name,
      email: item.email,
      team: item.team,
      robotName: item.robotName,
      robotCPU: item.robotCPU,
      robotROM: item.robotROM,
      robotRAM: item.robotRAM,
      robotMotorDriver: item.robotMotorDriver,
      robotMotor: item.robotMotor,
      robotADC: item.robotADC,
      robotSensor: item.robotSensor,
      eventName: item.eventName,
      entryOrder: item.entryOrder,
      realOrder: item.entryOrder,
      comment: item.comment,
      privacy: item.privacy,
    }));
  }

  async getParticipant(
    participantId: string,
    header: { Authorization: string },
  ): Promise<ParticipantItem> {
    const { data } = await axios.get(`/api/participants/${participantId}`, {
      headers: header,
    });

    return {
      participantId: data._id,
      competitionId: data.competitionId,
      eventId: data.eventId,
      name: data.name,
      email: data.email,
      team: data.team,
      robotName: data.robotName,
      robotCPU: data.robotCPU,
      robotROM: data.robotROM,
      robotRAM: data.robotRAM,
      robotMotorDriver: data.robotMotorDriver,
      robotMotor: data.robotMotor,
      robotADC: data.robotADC,
      robotSensor: data.robotSensor,
      eventName: data.eventName,
      entryOrder: data.entryOrder,
      realOrder: data.entryOrder,
      comment: data.comment,
      privacy: data.privacy,
    };
  }

  async createParticipant(
    participant: ParticipantInput,
  ): Promise<ParticipantItem> {
    const { data } = await axios.post(`/api/participants`, {
      _id: participant.participantId,
      ...participant,
    });

    return {
      participantId: data._id,
      competitionId: data.competitionId,
      eventId: data.eventId,
      name: data.name,
      email: data.email,
      team: data.team,
      robotName: data.robotName,
      robotCPU: data.robotCPU,
      robotROM: data.robotROM,
      robotRAM: data.robotRAM,
      robotMotorDriver: data.robotMotorDriver,
      robotMotor: data.robotMotor,
      robotADC: data.robotADC,
      robotSensor: data.robotSensor,
      eventName: data.eventName,
      entryOrder: data.entryOrder,
      realOrder: data.entryOrder,
      comment: data.comment,
      privacy: data.privacy,
    };
  }

  async updateParticipant(
    participant: ParticipantInput,
  ): Promise<ParticipantItem> {
    const { data } = await axios.patch(
      `/api/participants/${participant.participantId}`,
      {
        _id: participant.participantId,
        ...participant,
      },
    );

    return {
      participantId: data._id,
      competitionId: data.competitionId,
      eventId: data.eventId,
      name: data.name,
      email: data.email,
      team: data.team,
      robotName: data.robotName,
      robotCPU: data.robotCPU,
      robotROM: data.robotROM,
      robotRAM: data.robotRAM,
      robotMotorDriver: data.robotMotorDriver,
      robotMotor: data.robotMotor,
      robotADC: data.robotADC,
      robotSensor: data.robotSensor,
      eventName: data.eventName,
      entryOrder: data.entryOrder,
      realOrder: data.entryOrder,
      comment: data.comment,
      privacy: data.privacy,
    };
  }

  async deleteParticipant(
    participantId: string,
    header: { Authorization: string },
  ): Promise<void> {
    await axios.delete(`/api/participants/${participantId}`, {
      headers: header,
    });
  }
}
