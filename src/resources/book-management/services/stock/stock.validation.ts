import getObjectIdFromString from '@/utils/getObjectIdFromString';
import { z } from 'zod';

class StockVSchema {
  public upsertStock = z.object({
    bookId: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'book id required is required',
      })
      .transform((id) => getObjectIdFromString(id)),
    hardCover: z
      .number({
        invalid_type_error: 'Only number values are allowed',
      })
      .optional()
      .default(0),
    softCopy: z
      .number({
        invalid_type_error: 'Only number values are allowed',
      })
      .optional()
      .default(0),
    paperCopy: z
      .number({
        invalid_type_error: 'Only number values are allowed',
      })
      .optional()
      .default(0),
  });
}

export default StockVSchema;
