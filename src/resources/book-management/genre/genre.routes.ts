import type IRoute from '@/interfaces/route.interface';
import authenticate, {
  hasPermission,
} from '@/middlewares/authentication.middleware';
import {
  validateBody,
  validateParams,
} from '@/middlewares/validation.middleware';
import { Router } from 'express';
import GenreController from './genre.controller';
import GenreVSchema from './genre.validation';

class GenreRoutes implements IRoute {
  public path = '/genres';
  public router: Router = Router();
  private controller = new GenreController();
  private vSchema = new GenreVSchema();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    /**
     * endpoint `/api/v1/genres/`
     */
    this.router
      .route('/')
      .get(this.controller.readMany)
      .post(
        authenticate,
        hasPermission('librarian', 'owner'),
        validateBody(this.vSchema.create),
        this.controller.create
      );
    /**
     * endpoint `/api/v1/genres/:id`
     */
    this.router
      .route('/:id')
      .get(validateParams(this.vSchema.isValidId), this.controller.readOneById)
      .patch(
        validateParams(this.vSchema.isValidId),
        authenticate,
        hasPermission('librarian', 'owner'),
        validateBody(this.vSchema.update),
        this.controller.updateOneById
      )
      .delete(
        validateParams(this.vSchema.isValidId),
        authenticate,
        hasPermission('librarian', 'owner'),
        this.controller.deleteOneById
      );
  };
}

export default GenreRoutes;
