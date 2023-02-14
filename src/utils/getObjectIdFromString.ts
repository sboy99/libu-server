import { ObjectId } from 'bson';
import type { Types } from 'mongoose';
import { isValidObjectId } from 'mongoose';
import Errors from './exceptions/errors';

export default function getObjectIdFromString(str: string): Types.ObjectId {
  if (!isValidObjectId(str))
    throw new Errors.BadRequestError('Object id is not valid');
  return new ObjectId(str) as Types.ObjectId;
}
