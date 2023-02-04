import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';

import App from '@/App';
import validateEnv from '@/utils/validate.env';

validateEnv();

const app = new App([], Number(process.env.PORT ?? 5000));
app.listen();
