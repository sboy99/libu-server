import { toLowerCase } from '@/utils/zod-transforms';
import { Types, isValidObjectId } from 'mongoose';
import { z } from 'zod';

class BookVSchema {
  public create = z
    .object({
      /**
       *
       */
      name: z
        .string({
          invalid_type_error: 'only string values are allowed',
          required_error: 'book name is required',
        })
        .min(2, 'minimum name length should be 2')
        .max(50, 'maximum name length should be 50')
        .trim()
        .transform(toLowerCase),
      /**
       *
       */
      author: z
        .string({
          invalid_type_error: 'only string values are allowed',
          required_error: 'author name is required',
        })
        .min(2, 'minimum author name length should be 2')
        .max(50, 'maximum author name length should be 50')
        .trim()
        .transform(toLowerCase),
      /**
       *
       */
      description: z
        .string({
          invalid_type_error: 'only string values are allowed',
          required_error: 'A brief description of the book is required',
        })
        .min(25, 'minimum author name length should be 25')
        .trim(),
      /**
       *
       */
      publisher: z
        .string({
          invalid_type_error: 'only string values are allowed',
          required_error: 'author name is required',
        })
        .min(2, 'minimum publisher name length should be 2')
        .max(50, 'maximum publisher length should be 50')
        .trim()
        .transform(toLowerCase),
      /**
       *
       */
      images: z
        .object({
          publicId: z
            .string({
              required_error: 'image public id is required',
            })
            .trim(),
          url: z
            .string({
              invalid_type_error:
                'only string values are allowed for image url',
              required_error: 'image url is required',
            })
            .trim(),
        })
        .array()
        .min(4, 'Atleast four images are required'),
      /**
       *
       */
      thumbnail: z
        .number({
          invalid_type_error:
            'only number values are allowed for thumbnail index',
        })
        .optional()
        .default(0),
      /**
       *
       */
      genre: z
        .instanceof(Types.ObjectId, {
          message: 'genre of the book is required',
        })
        .refine(
          (objId) => isValidObjectId(objId),
          'genre Id is not a valid id'
        ),
      /**
       *
       */
      ISBN: z
        .string({
          invalid_type_error: 'only string values are allowed for ISBN',
          required_error: 'ISBN is required',
        })
        .trim(),
      /**
       *
       */
      price: z
        .number({
          invalid_type_error: 'price should be a number',
          required_error: 'price is required for the book',
        })
        .min(0, 'price should not be negetive'),
      /**
       *
       */
      visibility: z
        .enum(['public', 'private'], {
          invalid_type_error: 'visibility should be either public or private',
        })
        .default('private'),
      /**
       *
       */
      isFeatured: z.boolean().optional().default(false),
    })
    .refine((data) => {
      data.thumbnail < data.images.length;
    }, `thumnail index should not be less than images length`);
  /**
   *
   */
  public update = z.object({
    /**
     *
     */
    name: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'book name is required',
      })
      .min(2, 'minimum name length should be 2')
      .max(50, 'maximum name length should be 50')
      .trim()
      .transform(toLowerCase)
      .optional(),
    /**
     *
     */
    author: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'author name is required',
      })
      .min(2, 'minimum author name length should be 2')
      .max(50, 'maximum author length should be 50')
      .trim()
      .transform(toLowerCase)
      .optional(),
    /**
     *
     */
    description: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'A brief description of the book is required',
      })
      .min(25, 'minimum author name length should be 25')
      .trim()
      .optional(),
    /**
     *
     */
    publisher: z
      .string({
        invalid_type_error: 'only string values are allowed',
        required_error: 'author name is required',
      })
      .min(2, 'minimum author name length should be 2')
      .max(50, 'maximum author length should be 50')
      .trim()
      .transform(toLowerCase)
      .optional(),
    /**
     *
     */
    images: z
      .array(
        z.object({
          publicId: z.string(),
          url: z.string({
            invalid_type_error: 'only string values are allowed for image url',
            required_error: 'image url is required',
          }),
        })
      )
      .min(4, 'Atleast four images are required')
      .optional(),
    /**
     *
     */
    thumbnail: z
      .number({
        invalid_type_error:
          'only number values are allowed for thumbnail index',
      })
      .optional()
      .default(0),
    /**
     *
     */
    genre: z
      .instanceof(Types.ObjectId)
      .refine((objId) => isValidObjectId(objId), 'genre Id is not a valid id')
      .optional(),
    /**
     *
     */
    ISBN: z
      .string({
        invalid_type_error: 'only string values are allowed for ISBN',
        required_error: 'ISBN is required',
      })
      .optional(),
    /**
     *
     */
    price: z
      .number({
        invalid_type_error: 'price should be a number',
        required_error: 'price is required for the book',
      })
      .min(0, 'price can not be negetive')
      .optional(),
    /**
     *
     */
    visibility: z.enum(['public', 'private']).default('private').optional(),
    /**
     *
     */
    publishedAt: z
      .date({
        invalid_type_error: 'published at should be a date',
      })
      .optional(),
    /**
     *
     */
    isFeatured: z.boolean().optional().default(false),
  });
}

export default BookVSchema;
