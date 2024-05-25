import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cookie from 'koa-cookie';

import dotenv from 'dotenv';
import AuthRouter from './routes/api/auth.route';
import AuthService from './service/auth.service';

dotenv.config({
  override: true,
  encoding: 'utf8',
});

/* Services */
const authService = new AuthService({
  options: {
    adminID: process.env.ADMIN_ID || 'admin',
    authURL: process.env.AUTH_URL || 'auth.zetin.uos.ac.kr',
  },
});

/* Router */
const mainRouter = new Router({
  prefix: '/api',
});
const authRouter = new AuthRouter(
  {
    options: {
      cookieName: process.env.COOKIE_NAME || 'adminToken',
      cookiePath: process.env.COKIE_PATH || '/api',
    },
  },
  {
    authService: authService,
  },
);

/* Middleware */
mainRouter.use(cookie());
mainRouter.use(bodyParser());

mainRouter.use(async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = `${(err as Error).message}`;
  }
});

/* API server routes */
mainRouter.use('/admin', authRouter.routes());

export default mainRouter;
