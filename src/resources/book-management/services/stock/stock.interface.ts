import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import StockVSchema from './stock.validation';

interface IAdditionalFields {
  /**
   *
   */
  bookId: Types.ObjectId;
  /**
   *
   */
  isDeleted: boolean;
}

const stockVSchema = new StockVSchema();
export type TUpsertStock = z.infer<(typeof stockVSchema)['upsertStock']>;
export type TStockDocument = TUpsertStock &
  IAdditionalFields &
  Document<Types.ObjectId>;
