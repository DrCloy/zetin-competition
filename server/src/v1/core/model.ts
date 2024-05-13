export type AdminTokenPayload = {
  iss: string;
  exp: number;
  iat: number;
  sub: string;
  username: string;
};
