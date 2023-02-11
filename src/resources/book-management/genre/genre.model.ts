import { Schema, model } from 'mongoose';
import type { TGenreDocument } from './genre.interface';

const genreSchema = new Schema<TGenreDocument>({
  title: {
    type: String,
    unique: true,
    required: true,
    min: 2,
    max: 50,
    trim: true,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const GenreModel = model<TGenreDocument>('Genre', genreSchema);
export default GenreModel;
