import Koa from 'koa';

import mainRouter from './src/v1/routes/main';

const PORT = process.env.port;

const app = new Koa();
app.use(mainRouter.routes());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
