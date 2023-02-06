import type { IReturnsVoid } from '@/interfaces/app.interface';
import type IRoute from '@/interfaces/route.interface';

import { validateBody } from '@/middlewares/validation.middleware';
import { Router } from 'express';
import AuthController from './auth.controller';
import AuthVSchema from './auth.validation';

class AuthRoutes implements IRoute {
  public path = '/auth';
  public router: Router = Router();
  private controller = new AuthController();
  private vSchema = new AuthVSchema();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes: IReturnsVoid = () => {
    // endpoing: /api/v1/auth/register
    this.router
      .route('/register')
      .post(validateBody(this.vSchema.register), this.controller.register);
    // endpoing: /api/v1/auth/login
    this.router
      .route('/login')
      .post(validateBody(this.vSchema.login), this.controller.login);
    // endpoing: /api/v1/auth/logout
    this.router.route('/logout').get(this.controller.logout);
  };
}

export default AuthRoutes;
