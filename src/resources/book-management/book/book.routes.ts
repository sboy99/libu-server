import type IRoute from '@/interfaces/route.interface';
import authenticate, {
  hasPermission,
} from '@/middlewares/authentication.middleware';
import imageUploader from '@/middlewares/imageUpload.middleware';
import {
  validateBody,
  validateParams,
} from '@/middlewares/validation.middleware';
import { Router } from 'express';
import StockVSchema from '../services/stock/stock.validation';
import BookController from './book.controller';
import BookVSchema from './book.validation';

class BookRoutes implements IRoute {
  public path = '/books';
  public router: Router = Router();
  private controller: InstanceType<typeof BookController>;
  private vSchema: InstanceType<typeof BookVSchema>;
  private stockVSchema: InstanceType<typeof StockVSchema>;

  constructor() {
    this.controller = new BookController();
    this.vSchema = new BookVSchema();
    this.stockVSchema = new StockVSchema();
    this.initializeRoutes();
  }
  private initializeRoutes = () => {
    /**
     * endpoint `/api/v1/books/`
     */
    this.router
      .route('/')
      .get(this.controller.readAll)
      .post(
        authenticate,
        hasPermission('librarian', 'owner'),
        validateBody(this.vSchema.create),
        this.controller.create
      );
    /**
     * endpoing `/api/v1/books/upload`
     */
    this.router.route('/upload').post(
      authenticate,
      hasPermission('librarian', 'owner'),
      imageUploader('image', {
        maxUploadSize: 2,
        uploadType: 'single',
      }),
      this.controller.imageUpload
    );
    /**
     * endpoint `/api/v1/books/:id`
     */
    this.router
      .route('/:id')
      .get(validateParams(this.vSchema.params), this.controller.readOneById)
      .patch(
        validateParams(this.vSchema.params),
        authenticate,
        hasPermission('librarian', 'owner'),
        validateBody(this.vSchema.update),
        this.controller.updateOneById
      )
      .delete(
        authenticate,
        hasPermission('librarian', 'owner'),
        this.controller.deleteOneById
      );
    /**
     * endpoint `/api/v1/books/:id/stock`
     */
    this.router.route('/:id/stock').patch(
      validateParams(this.vSchema.params),
      authenticate,
      // Todo: protect this route, open only when payment is successfull
      validateBody(this.stockVSchema.upsertStock),
      this.controller.manageStocks
    );
  };
}

export default BookRoutes;
