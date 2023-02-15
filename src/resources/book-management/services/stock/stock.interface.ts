import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import StockVSchema from './stock.validation';

const stockVSchema = new StockVSchema();
export type TUpsertStock = z.infer<(typeof stockVSchema)['upsertStock']>;
export type TStockDocument = TUpsertStock & Document<Types.ObjectId>;
