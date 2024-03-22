export type CompetitionEvent = {
  id: string;
  participants: string[];
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
  'id' | 'name' | 'posterId'
>;

export type AuthInput = {
  id: string;
  pw: string;
};

export type UserItem = {
  id: string;
  status: boolean;
  token: string;
};
