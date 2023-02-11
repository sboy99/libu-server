import type { Document, Types } from 'mongoose';
import type { z } from 'zod';
import GenreVSchema from './genre.validation';

const genreVSchema = new GenreVSchema();

export type TGenreDocument = z.infer<(typeof genreVSchema)['create']> &
  Document<Types.ObjectId>;
export type TCreateGenre = Omit<
  z.infer<(typeof genreVSchema)['create']>,
  'isDeleted'
>;
export type TUpdateGenre = z.infer<(typeof genreVSchema)['update']>;
