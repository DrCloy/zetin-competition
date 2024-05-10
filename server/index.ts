import Koa from 'koa';

import mainRouter from './src/v1/routes/main';
import env from './env';

const PORT = env.port;

const app = new Koa();
app.use(mainRouter.routes());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
