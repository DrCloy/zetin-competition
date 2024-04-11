export type CompetitionEvent = {
  id: string;
  participants: ParticipantItem[] | string[];
  name: string;
  limit: number;
};

export type CompetitionItem = {
  id: string;
  name: string;
  description: string;
  events: CompetitionEvent[];
  regDateStart: Date;
  regDateEnd: Date;
  date: Date;
  place: string;
  googleMap: string;
  organizer: string;
  sponser: string;
  prize: string;
  rule: string;
  moreInfo: string;
  posterId: string;
};

export type CompetitionItemMeta = Pick<
  CompetitionItem,
  'id' | 'date' | 'regDateStart' | 'regDateEnd' | 'name' | 'posterId'
>;

export type AuthInput = {
  id: string;
  pw: string;
};

export type AuthPayload = {
  username: string;
  expiredAt: Date;
};

export type FileData = {
  id: string;
  name: string;
  description: string;
  private: boolean;
  filename: string;
  mimetype: string;
  size: number;
};

export type FileInput = {
  id?: string;
  name: string;
  description: string;
  private: boolean;
  file: FileList;
};

export type ParticipantItem = {
  participantId: string;
  competitionId: string;
  eventId: string;
  name: string;
  email: string;
  team: string;
  robotName: string;
  robotCPU: string;
  robotROM: string;
  robotRAM: string;
  robotMotorDriver: string;
  robotMotor: string;
  robotADC: string;
  robotSensor: string;
  eventName: string;
  entryOrder: number;
  realOrder: number;
  comment: string;
  privacy: boolean;
};

export type ParticipantItemMeta = Pick<
  ParticipantItem,
  'participantId' | 'eventId' | 'name' | 'team' | 'robotName' | 'entryOrder'
>;

export type ParticipantInput = {
  participantId?: string;
  competitionId: string;
  eventId: string;
  name: string;
  email: string;
  team: string;
  robotName: string;
  robotCPU: string;
  robotROM: string;
  robotRAM: string;
  robotMotorDriver: string;
  robotMotor: string;
  robotADC: string;
  robotSensor: string;
  eventName: string;
  entryOrder: number;
  comment: string;
  privacy: boolean;
  password?: string;
};
