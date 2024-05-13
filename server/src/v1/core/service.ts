import { AdminTokenPayload } from './model';

export default interface IAuthService {
  verifyAdmin(token: string): Promise<AdminTokenPayload>;
  signIn(
    id: string,
    pw: string,
  ): Promise<{
    token: string;
    payload: AdminTokenPayload;
  }>;
}
