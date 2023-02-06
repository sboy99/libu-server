import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';

import App from '@/App';
import validateEnv from '@/utils/validate.env';


import AuthRoutes from '@/resources/auth/auth.routes';
import UserRoutes from '@/resources/user/user.routes';

validateEnv();

const app = new App(
  [new UserRoutes(), new AuthRoutes()],
  Number(process.env.PORT ?? 5000)
);

app.listen();
