import { Schema, model } from 'mongoose';
import type { TStockDocument } from './stock.interface';

const stockSchema = new Schema<TStockDocument>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'BookId is required for stock'],
    },
    hardCover: {
      type: Number,
      default: 0,
    },
    softCopy: {
      type: Number,
      default: 0,
    },
    paperCopy: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
  }
);

const StockModel = model<TStockDocument>('Stock', stockSchema);
export default StockModel;
