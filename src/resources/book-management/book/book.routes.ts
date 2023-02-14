import type IRoute from '@/interfaces/route.interface';
import authenticate, {
  hasPermission,
} from '@/middlewares/authentication.middleware';
import { Router } from 'express';
import BookController from './book.controller';
import BookVSchema from './book.validation';

class BookRoutes implements IRoute {
  public path = '/books';
  public router: Router = Router();
  private controller: InstanceType<typeof BookController>;
  private vSchema: InstanceType<typeof BookVSchema>;

  constructor() {
    this.controller = new BookController();
    this.vSchema = new BookVSchema();
    this.initializeRoutes();
  }
  private initializeRoutes = () => {
    /**
     * endpoint `/api/v1/genres/`
     */
    this.router.route('/').get(this.controller.readAll).post(
      authenticate,
      hasPermission('librarian', 'owner'),
      // validateBody(this.vSchema.create),
      this.controller.create
    );
    /**
     * endpoint `/api/v1/genres/:id`
     */
    this.router
      .route('/:id')
      .get(this.controller.readOneById)
      .patch(
        authenticate,
        hasPermission('librarian', 'owner'),
        // validateBody(this.vSchema.create),
        this.controller.updateOneById
      )
      .delete(
        authenticate,
        hasPermission('librarian', 'owner'),
        this.controller.deleteOneById
      );
    /**
     * todo: integrate stocks and reviews
     */
  };
}

export default BookRoutes;
