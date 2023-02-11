import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';
import Errors from '@/utils/exceptions/errors';
import type { TCreateGenre, TUpdateGenre } from './genre.interface';
import GenreModel from './genre.model';

class GenreController {
  private db: typeof GenreModel;

  constructor() {
    this.db = GenreModel;
  }
  /**
   * **Creates a genre of a book | permited roles `librarian` and `owner`**
   * - Retrive title from body
   * - Search for the title in the DB as its unique
   * - If it exist send a bad request otherwise
   * - Create a new genre
   * - Send a successfull message
   * @param req express request
   * @param res express response
   */
  public create: ApiRequestHandler<
    TCreateGenre,
    IResMessage & { data: TCreateGenre }
  > = async (req, res) => {
    const { title, categories } = req.body;
    const isGenreExist = await this.db.findOne({ title });
    if (isGenreExist) {
      if (isGenreExist.isDeleted) {
        const genre = isGenreExist;
        genre.isDeleted = false;
        genre.categories = categories;
        const mGenre = await genre.save();
        return res.status(201).json({
          type: 'success',
          message: 'Successfully created new genre',
          data: mGenre,
        });
      }
      throw new Errors.BadRequestError(`Genre '${title}' already exist`);
    }
    const genre = await this.db.create(req.body);
    res.status(201).json({
      type: 'success',
      message: 'Successfully created new genre',
      data: genre,
    });
  };
  /**
   *
   * @param req express request
   * @param res express response
   */
  public readMany: ApiRequestHandler<
    unknown,
    IResMessage & { count: number; data: TCreateGenre[] }
  > = async (req, res) => {
    const count = await this.db.countDocuments();
    const genres = await this.db
      .find({ isDeleted: false })
      .select('-isDeleted -__v');
    res.status(200).json({
      type: 'success',
      message: 'Succefully found genres',
      count,
      data: genres,
    });
  };
  /**
   * **Find a book based on passed id**
   * - Destructure `id` from params
   * - Search for a genre with the same id
   * - If no genre is found send a not found exception otherwise
   * - Send a successful message with the data
   * @param req express request
   * @param res express response
   */
  public readOneById: ApiRequestHandler<
    unknown,
    IResMessage & { data: TCreateGenre }
  > = async (req, res) => {
    const { id: genreId } = req.params;
    const genre = await this.db
      .findOne({ _id: genreId, isDeleted: false })
      .select('-isDeleted -__v');
    if (!genre)
      throw new Errors.NotFoundError('Requested genre does not exist');
    res.status(200).json({
      type: 'success',
      message: 'Succefully found requested genre',
      data: genre,
    });
  };
  /**
   * **Updates a genre | permited roles `librarian` and `owner`**
   * - Destructure `id` from params
   * - Search for the genre by id
   * - If no genre found send a not found exception otherwise
   * - Push categories if passed and handle duplicates
   * - Save the document
   * - Send a successful message with the updated data
   * @param req express request
   * @param res express response
   */
  public updateOneById: ApiRequestHandler<
    TUpdateGenre,
    IResMessage & { data: TCreateGenre }
  > = async (req, res) => {
    const { id: genreId } = req.params;
    const genre = await this.db
      .findOne({ _id: genreId, isDeleted: false })
      .select('-isDeleted -__v');
    if (!genre)
      throw new Errors.NotFoundError('Requested genre does not exist');
    const { categories, title } = req.body;
    if (title) {
      genre.title = title;
    }
    if (categories && categories.length) {
      const categorySet = new Set<string>(genre.categories);
      for (const category of categories) {
        if (category.startsWith('-')) {
          categorySet.delete(category.substring(1, category.length));
        } else categorySet.add(category);
      }
      const categoryArray = Array.from(categorySet);
      genre.categories = categoryArray;
    }
    const mGenre = await genre.save();
    res.status(200).json({
      type: 'success',
      message: 'Successfully updated genre',
      data: mGenre,
    });
  };
  /**
   *
   * @param req express request
   * @param res express response
   */
  public deleteOneById: ApiRequestHandler<unknown, IResMessage> = async (
    req,
    res
  ) => {
    const { id: genreId } = req.params;
    const genre = await this.db.findOneAndUpdate(
      { _id: genreId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!genre)
      throw new Errors.NotFoundError('Requested genre does not exist');
    res.status(200).json({
      type: 'success',
      message: 'Genre deleted successfully',
    });
  };
}

export default GenreController;
