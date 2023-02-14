import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import BookVSchema from './book.validation';

interface additionalFields {
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
}

const bookVSchema = new BookVSchema();
export type TBookCreate = z.infer<(typeof bookVSchema)['create']>;
export type TBookUpdate = z.infer<(typeof bookVSchema)['update']>;
export type TBookDocument = TBookCreate &
  additionalFields &
  Document<Types.ObjectId>;
