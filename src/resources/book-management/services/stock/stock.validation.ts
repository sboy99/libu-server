import { z } from 'zod';

class StockVSchema {
  public upsertStock = z.object({
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
