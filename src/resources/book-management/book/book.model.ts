import { Schema, model } from 'mongoose';
import ReviewModel from '../review/review.model';
import type { TBookDocument } from './book.interface';

const bookSchema = new Schema<TBookDocument>(
  {
    author: {
      type: String,
      minlength: [2, 'minimum author name length should be 2'],
      maxlength: [50, 'maximum author name length should be 50'],
      required: [true, 'author name is required'],
      trim: true,
    },
    name: {
      type: String,
      minlength: [2, 'minimum  name length should be 2'],
      maxlength: [50, 'maximum name length should be 50'],
      required: [true, 'name is required'],
      trim: true,
    },
    description: {
      type: String,
      minlength: [25, 'minimum decription length should be 25'],
      required: [true, 'name is required'],
      trim: true,
    },
    publisher: {
      type: String,
      minlength: [2, 'minimum publisher name length should be 2'],
      maxlength: [50, 'maximum publisher namelength should be 50'],
      required: [true, 'pablisher name is required'],
      trim: true,
    },
    images: [
      {
        id: {
          type: String,
          required: [true, 'image public id is required'],
          trim: true,
        },
        url: {
          type: String,
          required: [true, 'image url is required'],
          trim: true,
        },
      },
    ],
    thumbnail: {
      type: Number,
      default: 0,
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: 'Genre',
      required: [true, 'genre of the book is required'],
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      min: [0, 'price should not be negetive'],
      required: [true, 'price is required for the book'],
    },
    visibility: {
      type: String,
      enum: {
        values: ['public', 'private'],
        message: 'visibility should be either public or private',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'specify the user who created it'],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    validateBeforeSave: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookSchema.index({ name: 1, author: 1 }, { unique: true });
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId',
  justOne: false,
  limit: 5,
  options: {
    match: { isDeleted: false },
    select: 'ratings reviewedBy reviews',
    populate: {
      path: 'reviewedBy',
      select: 'name email isVerified',
    },
  },
});

// todo: stock virtuals
bookSchema.virtual('stock', {
  ref: 'Stock',
  localField: '_id',
  foreignField: 'bookId',
  justOne: true,
  options: {
    match: { isDeleted: false },
    select: '-createdAt -updatedAt -isDeleted -__v',
  },
});

bookSchema.pre('save', async function () {
  if (this.isModified('isDeleted') && this.isDeleted) {
    await ReviewModel.updateMany(
      { bookId: this._id, isDeleted: false },
      { isDeleted: true }
    );
    this.deletedAt = new Date(Date.now());
  }
});

const BookModel = model<TBookDocument>('Book', bookSchema);
export default BookModel;
