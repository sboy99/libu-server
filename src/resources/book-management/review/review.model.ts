import { Schema, model } from 'mongoose';
import type { TReviewDocument } from './review.interface';

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

// reviewSchema.virtual('review').get(function () {
//   if (this.reviews && this.reviews?.length > 0) {
//     return this.reviews[this.reviews.length - 1];
//   }
// });

const ReviewModel = model<TReviewDocument>('Review', reviewSchema);
export default ReviewModel;
