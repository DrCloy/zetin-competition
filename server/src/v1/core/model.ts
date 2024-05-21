/* Model 추상화 레이어
 * Service 레이어에서 사용할 데이터 모델의 추상화된 모델을 정의
 */

export type AdminTokenPayload = {
  expired: number;
  username: string;
  role: 'admin' | 'participant';
};

export type Participant = {
  _id: string;
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
  entryOrder: number;
  comment: string;
  privacyAgreed: boolean;
};

export type CompetitionEvent = {
  _id: string;
  participants: Participant[] | string[];
  name: string;
  desc: string;
  numb: number;
};

export type Competition = {
  _id: string;
  name: string;
  desc: string;
  events: CompetitionEvent[] | string[];
  date: string;
  regDateStart: string;
  regDateEnd: string;
  place: string;
  googleMap: string;
  organizer: string;
  sponsor: string;
  prize: string;
  rule: string;
  moreInfo: string;
  posterId: string;
};

export type Password = {
  targetId: string;
  digest: string;
  hash: string;
  iteration: number;
  salt: number;
};

export type FileItem = {
  name: string;
  description: boolean;
  private: boolean;
  filename: string;
  mimetype: string;
  size: number;
};
