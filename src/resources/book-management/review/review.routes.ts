import type IRoute from '@/interfaces/route.interface';
import authenticate from '@/middlewares/authentication.middleware';
import {
  validateBody,
  validateParams,
  validateQueries,
} from '@/middlewares/validation.middleware';
import { Router } from 'express';
import ReviewController from './review.controller';
import ReviewVSchema from './review.validation';

class ReviewRoutes implements IRoute {
  public path = '/books';
  public router: Router = Router();
  private controller = new ReviewController();
  private vSchema = new ReviewVSchema();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * endpoint: /api/v1/books/:bookId/reviews/
     */
    this.router
      .route('/:bookId/reviews/')
      .get(
        validateParams(this.vSchema.bookId),
        validateQueries(this.vSchema.reviewQuery),
        this.controller.readAll
      )
      .post(
        validateParams(this.vSchema.bookId),
        authenticate,
        validateBody(this.vSchema.create),
        this.controller.create
      );
    /**
     * endpoint: /api/v1/books/:bookId/reviews/:id
     */
    this.router
      .route('/:bookId/reviews/:reviewId')
      .get(
        validateParams(this.vSchema.bookIdAndReviewId),
        this.controller.readOneById
      )
      .patch(
        validateParams(this.vSchema.bookIdAndReviewId),
        authenticate,
        validateBody(this.vSchema.update),
        this.controller.updateOneById
      )
      .delete(
        validateParams(this.vSchema.bookIdAndReviewId),
        authenticate,
        this.controller.deleteOneById
      );
  }
}

export default ReviewRoutes;
