import Koa from 'koa';
import Router from 'koa-router';
import { z } from 'zod';
import IAuthService from '../../core/service';

export default class AuthRouter extends Router {
  private cookieName: string;
  private cookiePath: string;
  private authService: IAuthService;
  constructor(
    params: { options: { cookieName: string; cookiePath: string } },
    di: {
      authService: IAuthService;
    },
  ) {
    super();

    this.cookieName = params.options.cookieName;
    this.cookiePath = params.options.cookiePath;
    this.authService = di.authService;

    this.get('/status', this.status());
    this.post('/signin', this.signIn());
    this.post('/signout', this.signOut());
  }

  private status(): Koa.Middleware {
    return async (ctx: Koa.Context) => {
      const token = ctx.cookies.get(this.cookieName) || '';
      const payload = await this.authService.verifyAdmin(token);

      ctx.response.body = payload;
    };
  }

  private signIn(): Koa.Middleware {
    const schema = z.object({
      id: z.string(),
      pw: z.string(),
    });
    return async (ctx: Koa.Context) => {
      const { id, pw }: { id: string; pw: string } = schema.parse(
        ctx.request.body,
      );
      const { token, payload } = await this.authService.signIn(id, pw);

      ctx.cookies.set(this.cookieName, token, {
        httpOnly: true,
        path: this.cookiePath,
      });
      ctx.response.body = payload;
    };
  }

  private signOut(): Koa.Middleware {
    return async (ctx: Koa.Context) => {
      ctx.cookies.set(this.cookieName, '', {
        httpOnly: true,
        path: this.cookiePath,
      });
      ctx.response.body = { message: 'Success' };
    };
  }
}
