import Koa from 'koa';

import mainRouter from './src/v1/routes/main';

import dotenv from 'dotenv';

dotenv.config({
  override: true,
  encoding: 'utf8',
});

const PORT = process.env.PORT;

const app = new Koa();
app.use(mainRouter.routes());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
