import axios from 'axios';
import { ParticipantInput, ParticipantItem } from 'core/model';
import { ParticipantManagementRepository } from 'core/repository';

export class ParticipantBackend implements ParticipantManagementRepository {
  async getParticipants(eventId: string): Promise<ParticipantItem[]> {
    const { data } = await axios.get(
      `/api/competitions/${eventId}/participants`,
    );

    return data.map((participant: any) => ({
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
    })) as ParticipantItem[];
  }

  async createParticipant(
    participant: ParticipantInput,
  ): Promise<ParticipantItem> {
    const { data } = await axios.post(`/api/participants`, participant);

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
      participant,
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
