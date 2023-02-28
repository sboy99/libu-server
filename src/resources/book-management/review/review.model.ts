/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Types } from 'mongoose';
import type { TReviewDocument } from './review.interface';

import Errors from '@/utils/exceptions/errors';
import { Schema, model } from 'mongoose';

interface IAggregateReviews {
  _id: Types.ObjectId;
  avgRatings: number;
  totalReviews: number;
}

const reviewSchema = new Schema<TReviewDocument>(
  {
    ratings: {
      type: Number,
      min: 1,
      max: 5,
      trim: true,
      required: [true, 'please provide a ratings'],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bookId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    reviews: [
      {
        title: {
          type: String,
          minlength: 5,
          maxlength: 100,
          required: true,
        },
        comment: {
          type: String,
          minlength: 5,
          maxlength: 500,
          required: true,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
    toJSON: {
      virtuals: true,
    },
    virtuals: true,
  }
);
reviewSchema.index({ bookId: 1, reviewedBy: 1 }, { unique: true });

reviewSchema.statics.calculateReviews = async function (
  bookId: Types.ObjectId
) {
  const aggregationResult = await this.aggregate([
    {
      $match: { bookId: bookId, isDeleted: false },
    },
    {
      $group: {
        _id: bookId,
        avgRatings: { $avg: '$ratings' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (aggregationResult.length) {
      const result = aggregationResult[0] as IAggregateReviews;
      await model('Book').findByIdAndUpdate(bookId, {
        ratings: Number(result.avgRatings.toFixed(1)),
        totalReviews: result.totalReviews,
      });
    }
  } catch (error) {
    throw new Errors.NotFoundError('book not found');
  }
};

reviewSchema.post('save', async function () {
  // @ts-ignore
  await this.constructor.calculateReviews(this.bookId);
});
// reviewSchema.virtual('review').get(function () {
//   if (this.reviews && this.reviews?.length > 0) {
//     return this.reviews[this.reviews.length - 1];
//   }
// });

const ReviewModel = model<TReviewDocument>('Review', reviewSchema);
export default ReviewModel;
