import type { Document, Model, Types } from 'mongoose';
import type { z } from 'zod';
import ReviewVSchema from './review.validation';

export interface IAdditonalReviewFields {
  /**
   *
   */
  reviewedBy: Types.ObjectId;
  /**
   *
   */
  bookId: Types.ObjectId;
  /**
   *
   */
  isDeleted: boolean;
}

interface IStaticFunctionsOfReviewModel {
  calculateReviews(bookId: Types.ObjectId): Promise<void>;
}

const reviewVSchema = new ReviewVSchema();
export type TCreateReview = z.infer<(typeof reviewVSchema)['create']>;
export type TUpdateReview = z.infer<(typeof reviewVSchema)['update']>;
export type TReviewQuery = z.infer<(typeof reviewVSchema)['reviewQuery']>;
export type TReviewParams = z.infer<
  (typeof reviewVSchema)['bookIdAndReviewId']
>;
export type TReviewDocument = TCreateReview &
  IAdditonalReviewFields &
  Document<Types.ObjectId>;

export type TReviewModel = Model<TReviewDocument> &
  IStaticFunctionsOfReviewModel;
