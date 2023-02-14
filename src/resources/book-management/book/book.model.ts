import { Schema, model } from 'mongoose';
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
        publicId: {
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
      required: [true, 'genre of the book is required'],
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
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
      default: 0.0,
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
    virtuals: true,
    toJSON: { virtuals: true },
  }
);

const BookModel = model<TBookDocument>('Book', bookSchema);
export default BookModel;
