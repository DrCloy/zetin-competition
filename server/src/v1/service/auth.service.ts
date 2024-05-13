import axios from 'axios';
import { AdminTokenPayload } from '../core/model';
import IAuthService from '../core/service';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import createError from 'http-errors';

export default class AuthService implements IAuthService {
  readonly adminID: string;
  readonly authURL: string;
  constructor(params: { options: { adminID: string; authURL: string } }) {
    this.adminID = params.options.adminID;
    this.authURL = params.options.authURL;
  }

  async verifyAdmin(token: string): Promise<AdminTokenPayload> {
    try {
      const resKeys = await axios.get('https://' + this.authURL + '/keys');
      const publicKey = jwkToPem(resKeys.data[0]);
      const payload = jwt.verify(token, publicKey) as AdminTokenPayload;

      const adminIDList = this.adminID.split(',');
      if (adminIDList.indexOf(payload.username) > -1) {
        return payload as AdminTokenPayload;
      } else {
        throw createError(401, '해당 계정은 관리자가 아닙니다.');
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw createError(401, 'JWT가 만료되었습니다.');
      } else if (error instanceof jwt.NotBeforeError) {
        throw createError(401, 'JWT가 활성화되지 않았습니다.');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw createError(401, 'JWT 검증에 실패했습니다.');
      } else {
        throw error;
      }
    }
  }

  async signIn(
    id: string,
    pw: string,
  ): Promise<{
    token: string;
    payload: AdminTokenPayload;
  }> {
    const resLogin = await axios.post('https://' + this.authURL + '/auth', {
      id: id,
      pw: pw,
    });
    const { status, token } = resLogin.data;

    if (status !== 'success') {
      throw createError(
        401,
        'ZETIN 로그인에 실패했습니다. 아이디와 비밀번호를 다시 확인해주십시오.',
      );
    }

    const payload = (await this.verifyAdmin(token)) as AdminTokenPayload;

    return {
      token,
      payload,
    };
  }
}
