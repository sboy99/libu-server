import type { IReturnsVoid } from '@/interfaces/app.interface';
import type IRoute from '@/interfaces/route.interface';

import authenticate from '@/middlewares/authentication.middleware';
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
    // endpoint: /api/v1/auth/register
    this.router
      .route('/register')
      .post(validateBody(this.vSchema.register), this.controller.register);
    // endpoint: /api/v1/auth/login
    this.router
      .route('/login')
      .post(validateBody(this.vSchema.login), this.controller.login);
    // endpoint: /api/v1/auth/logout | everyone can logout
    this.router.route('/logout').get(authenticate, this.controller.logout);
    // endpoint: /api/v1/auth/verify-email
    this.router
      .route('/verify-email')
      .post(validateBody(this.vSchema.verifyOtp), this.controller.verifyEmail);
    // endpoint: /api/v1/auth/verify-email
    this.router
      .route('/forgot-password')
      .post(
        validateBody(this.vSchema.forgotPassword),
        this.controller.forgotPassword
      );
    // endpoint: /api/v1/auth/reset-password
    this.router
      .route('/reset-password')
      .post(
        validateBody(this.vSchema.resetPassword),
        this.controller.resetPassword
      );
    // endpoint: /api/v1/auth/resend-otp
    this.router
      .route('/resend-otp')
      .post(validateBody(this.vSchema.resendOtp), this.controller.resendOtp);
  };
}

export default AuthRoutes;
