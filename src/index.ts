import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';

import App from '@/App';
import validateEnv from '@/utils/validate.env';

import AuthRoutes from '@/resources/auth/auth.routes';
import GenreRoutes from '@/resources/book-management/genre/genre.routes';
import UserRoutes from '@/resources/user/user.routes';

const routes = [AuthRoutes, UserRoutes, GenreRoutes];

validateEnv();
const app = new App(
  routes.map((route) => new route()),
  Number(process.env.PORT ?? 5000)
);
app.listen();
