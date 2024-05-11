import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import dotenv from 'dotenv';
import AuthRouter from './api/auth.route';

dotenv.config({
  override: true,
  encoding: 'utf8',
});

const mainRouter = new Router();
const authRouter = new AuthRouter({
  options: {
    cookieName: process.env.COOKIE_NAME || 'adminToken',
    cookiePath: process.env.COKIE_PATH || '/api',
  },
});

mainRouter.use(async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = `Internal Error: ${(err as Error).message}`;
  }
});

mainRouter.use('/auth', authRouter.routes());

export default mainRouter;
