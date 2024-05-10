import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import dotenv from 'dotenv';

dotenv.config({
  override: true,
  encoding: 'utf8',
});

const mainRouter = new Router();

export default mainRouter;
