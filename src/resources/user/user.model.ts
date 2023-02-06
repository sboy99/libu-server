import type { Model } from 'mongoose';
import { model } from 'mongoose';
import type { TUser } from './user.interface';

import mongoose, { Schema } from 'mongoose';

const objectId = mongoose.Types.ObjectId;

type TModel = Model<TUser>;

const UserSchema = new Schema<TUser, TModel>(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      minlength: [2, 'minimum length of name should be 2'],
      maxlength: [50, 'maximum length of name should be 50'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'email is required'],
      unique: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must have atleast 6 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ['reader', 'librarian', 'owner'],
        message: 'Role does not trivial',
      },
      default: 'reader',
    },
    mobile: {
      type: Number,
      trim: true,
      default: null,
    },
    address: [
      {
        addressId: objectId,
        ref: 'Address',
      },
    ],
    bag: [
      {
        bagId: objectId,
        ref: 'Bag',
      },
    ],
  },
  { timestamps: true, validateBeforeSave: true }
);

const UserModel = model<TUser, TModel>('User', UserSchema);

export default UserModel;
