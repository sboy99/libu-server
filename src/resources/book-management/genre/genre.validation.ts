import { removeDuplicatesFromArray, toLowerCase } from '@/utils/zod-transforms';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

class GenreVSchema {
  /**
   * Genre validation schema on create request
   */
  public create = z.object({
    title: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'title is required',
      })
      .min(2, 'minimum title length should be 2')
      .max(50, 'maximum title length should be 50')
      .trim()
      .transform(toLowerCase),
    categories: z
      .array(
        z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'category name is required',
          })
          .transform(toLowerCase)
      )
      .transform(removeDuplicatesFromArray)
      .optional()
      .default([]),
    isDeleted: z.boolean().optional().default(false),
  });
  /**
   * Genre validation schema on update request
   */
  public update = z.object({
    title: z
      .string({
        invalid_type_error: 'only string values are allowed',
      })
      .min(2, 'minimum title length should be 2')
      .max(50, 'maximum title length should be 50')
      .trim()
      .transform(toLowerCase)
      .optional(),
    categories: z
      .array(
        z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'category name is required',
          })
          .transform(toLowerCase)
      )
      .transform(removeDuplicatesFromArray)
      .optional(),
  });

  public isValidId = z.object({
    id: z
      .string({
        required_error: 'Valid object id is required',
        invalid_type_error: 'Requested Id is not a valid Id',
      })
      .refine((str) => isValidObjectId(str), 'Requested Id is not a valid Id'),
  });
}

export default GenreVSchema;
