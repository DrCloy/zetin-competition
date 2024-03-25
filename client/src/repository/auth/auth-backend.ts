import axios from 'axios';
import { AuthInput, AuthPayload } from 'core/model';
import { AuthRepository } from 'core/repository';

export default class AuthBackendRepo implements AuthRepository {
  async signin(auth: AuthInput): Promise<AuthPayload> {
    try {
      const res = await axios.post('/api/admin/signin', auth);
      return {
        username: res.data.username,
        expiredAt: new Date(res.data.exp * 1000),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      } else {
        throw error;
      }
    }
  }

  async signout(): Promise<void> {
    try {
      await axios.post('/api/admin/signout');
    } catch (error) {
      throw error;
    }
  }

  async getStatus(): Promise<AuthPayload> {
    try {
      const res = await axios.get('/api/admin/status');
      return {
        username: res.data.username,
        expiredAt: new Date(res.data.exp * 1000),
      };
    } catch (error) {
      throw error;
    }
  }
}
