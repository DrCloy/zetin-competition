import axios from 'axios';
import { ParticipantInput, ParticipantItem } from 'core/model';
import { ParticipantManagementRepository } from 'core/repository';

export class ParticipantBackend implements ParticipantManagementRepository {
  async getParticipants(competitionId: string): Promise<ParticipantItem[]> {
    const { data } = await axios.get(
      `/api/competitions/${competitionId}/participants`,
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
      comment: item.comment,
      privacy: item.privacy,
    }));
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
      comment: data.comment,
      privacy: data.privacy,
    };
  }

  async updateParticipant(
    participant: ParticipantInput,
  ): Promise<ParticipantItem> {
    const { data } = await axios.put(
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
      comment: data.comment,
      privacy: data.privacy,
    };
  }

  async deleteParticipant(participantId: string): Promise<void> {
    await axios.delete(`/api/participants/${participantId}`);
  }
}
