import getObjectIdFromString from '@/utils/getObjectIdFromString';
import { toLowerCase } from '@/utils/zod-transforms';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

class ReviewVSchema {
  public create = z.object({
    ratings: z
      .number({
        invalid_type_error: 'only number values are allowed',
        required_error: 'ratings is required',
      })
      .min(1, 'minimum rating should be 1')
      .max(5, 'maximum rating should be 5'),
    /**
     *
     */
    reviews: z
      .object({
        title: z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'review title is required',
          })
          .min(5, 'review title should be atleast 5 letters long')
          .max(100, 'review title should be atmost 100 characters long')
          .trim()
          .transform(toLowerCase),
        /**
         *
         */
        comment: z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'review description is required',
          })
          .min(5, 'review description should be atleast 5 letters long')
          .max(500, 'review title should be atmost 500 characters long')
          .trim(),
      })
      .array()
      .optional()
      .default([]),
  });
  public update = z.object({
    ratings: z
      .number({
        invalid_type_error: 'only number values are allowed',
        required_error: 'ratings is required',
      })
      .min(1, 'minimum rating should be 1')
      .max(5, 'maximum rating should be 5')
      .optional(),
    /**
     *
     */
    reviews: z
      .object({
        title: z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'review title is required',
          })
          .min(5, 'review title should be atleast 5 letters long')
          .max(100, 'review title should be atmost 100 characters long')
          .trim()
          .transform(toLowerCase),
        /**
         *
         */
        comment: z
          .string({
            invalid_type_error: 'only string values are allowed',
            required_error: 'review description is required',
          })
          .min(5, 'review description should be atleast 5 letters long')
          .max(500, 'review title should be atmost 500 characters long')
          .trim(),
      })
      .array()
      .optional(),
  });
  /**
   *
   */
  public bookId = z.object({
    bookId: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'book id required is required',
      })
      .refine((v) => isValidObjectId(v), 'book id is not a valid Id'),
  });
  /**
   *
   */
  public bookIdAndReviewId = z.object({
    bookId: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'book id required is required',
      })
      .refine((v) => isValidObjectId(v), 'book Id is not a valid Id')
      .transform((id) => getObjectIdFromString(id)),
    reviewId: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'book id required is required',
      })
      .refine((v) => isValidObjectId(v), 'review Id is not a valid Id')
      .transform((id) => getObjectIdFromString(id)),
  });
  /**
   *
   */
  public reviewQuery = z.object({
    select: z
      .string()
      .optional()
      .transform((str) => str?.split(',').join(' ')),
    sort: z
      .string()
      .optional()
      .transform((str) => str?.split(',').join(' ')),
    limit: z
      .string()
      .optional()
      .transform((v) => {
        if (v) {
          const num = Number(v);
          if (num > 0) return num;
        }
        return 5;
      }),
    page: z
      .string()
      .optional()
      .transform((v) => {
        if (v) {
          const num = Number(v);
          if (num > 0) return num;
        }
        return 1;
      }),
    //  todo : add filtering
  });
}

export default ReviewVSchema;
