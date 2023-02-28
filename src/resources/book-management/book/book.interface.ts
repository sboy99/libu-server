import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import BookVSchema from './book.validation';

export interface TAdditionalFields {
  /**
   *
   */
  publishedAt: Date;
  /**
   *
   */
  createdBy: Types.ObjectId;
  /**
   *
   */
  isDeleted: boolean;
  /**
   *
   */
  deletedAt: Date;
  /**
   *
   */
  ratings: number;
  /**
   *
   */
  totalReviews: number;
  /**
   *
   */
}

const bookVSchema = new BookVSchema();
export type TBookCreate = z.infer<(typeof bookVSchema)['create']>;
export type TBookUpdate = z.infer<(typeof bookVSchema)['update']>;
export type TBookParams = z.infer<(typeof bookVSchema)['params']>;
export type TBookDocument = TBookCreate &
  TAdditionalFields &
  Document<Types.ObjectId>;
