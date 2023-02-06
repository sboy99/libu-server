import type { IReturnsVoid } from '@/interfaces/app.interface';
import type IRoute from '@/interfaces/route.interface';

import { Router } from 'express';
import UserController from './user.controller';
import userVSchema from './user.validation';

class UserRoutes implements IRoute {
  public path = `/users`;
  public router: Router = Router();
  private controller = new UserController();
  private validationSchema = userVSchema;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes: IReturnsVoid = () => {
    // enpoint /api/v1/users/
    this.router.route('/').get(this.controller.readMany);
    // enpoint /api/v1/users/:id
    this.router
      .route('/:id')
      .get(this.controller.readOneById)
      .patch(this.controller.updateOneById)
      .delete(this.controller.deleteOneById);
  };
}

export default UserRoutes;
