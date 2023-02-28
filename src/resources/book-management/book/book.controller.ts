import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';
import type {
  TAdditionalFields,
  TBookCreate,
  TBookDocument,
  TBookParams,
  TBookUpdate,
} from './book.interface';

import type { IUploadedImage } from '@/interfaces/app.interface';
import ImageUploadService from '@/services/upload/imageUpload.service';
import Errors from '@/utils/exceptions/errors';
import getObjectIdFromString from '@/utils/getObjectIdFromString';
import StockService from '../services/stock/stock.service';
import BookModel from './book.model';

class BookController {
  private db = BookModel;
  private useStockService = new StockService();
  private useImageUploadService = new ImageUploadService();
  /**
   * **Create a brand new book**
   * - Add created by `userId` in book data
   * - Create a book with new data
   * - Send a successful response with created data;
   * @param req express request
   * @param res express responase
   */
  public create: ApiRequestHandler<
    TBookCreate,
    IResMessage & { data: TBookDocument }
  > = async (req, res) => {
    const bookData = req.body as TBookCreate & TAdditionalFields;
    bookData.createdBy = getObjectIdFromString(req.user.userId);
    const book = await this.db.create(bookData);
    res.status(200).json({
      type: 'success',
      message: 'book created successfully',
      data: book,
    });
  };
  /**
   * **Reads all book**
   * - Find all books that were created only select specific fields
   * - Set `thumbnail` field based on thumbnail index
   * - Send a successful response with the data
   * @param req express request
   * @param res express responase
   */
  public readAll: ApiRequestHandler<
    unknown,
    IResMessage & { count: number; data: Record<string, unknown>[] }
  > = async (req, res) => {
    // Todo: enable quering

    const books = await this.db
      .find({ isDeleted: false }, {}, { lean: true })
      .select('name author price images thumbnail createdAt ratings')
      .sort('-createdAt');

    const count = books.length;
    const thumbnailOnlyBooks = books.reduce<Record<string, unknown>[]>(
      (acc, curr) => {
        const { images, ...mCurr } = curr;
        (mCurr['thumbnail'] as unknown) = images[curr.thumbnail];

        acc.push(mCurr);
        return acc;
      },
      []
    );

    res.status(200).json({
      type: 'success',
      message: count ? `Successfully found ${count} books` : `No book found`,
      count,
      data: thumbnailOnlyBooks,
    });
  };
  /**
   * **Reads one single book completely**
   * - Grab `bookId` from query params
   * - Search for book matches that `bookId`
   * - Throw error if no book found otherwise
   * - Send a successfull response along with searched data
   * @param req express request
   * @param res express responase
   */
  public readOneById: ApiRequestHandler<
    unknown,
    IResMessage & { data: TBookDocument },
    TBookParams
  > = async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findOne({ _id: id, isDeleted: false })
      .select('-isDeleted -deletedAt -updatedAt -__v')
      .populate('reviews')
      .populate('genre', '-isDeleted -__v');

    if (!book) throw new Errors.NotFoundError('requested book not found');

    res.status(200).json({
      type: 'success',
      message: 'successfully fetched book details',
      data: book,
    });
  };
  /**
   * **Update book details**
   * - Grab `bookId` from query params
   * - Search for book matches that `bookId`
   * - Throw error if no book found otherwise
   * - Update the book details
   * - Send a successfull response
   * @param req express request
   * @param res express responase
   */
  public updateOneById: ApiRequestHandler<
    TBookUpdate,
    IResMessage & { data: TBookDocument | null },
    TBookParams
  > = async (req, res) => {
    // early exit
    const hasUpdatableKey = Object.keys(req.body);
    if (hasUpdatableKey.length < 1) {
      return res.status(200).json({
        type: 'warning',
        message: 'nothing to update in this book',
        data: null,
      });
    }

    const { id } = req.params;
    const isBook = await BookModel.findOne({ _id: id, isDeleted: false });
    if (!isBook) throw new Errors.NotFoundError('book not found');
    const { visibility } = req.body;
    if (visibility && visibility === 'public') {
      if (!isBook.publishedAt) req.body.publishedAt = new Date(Date.now());
    }
    const book = await BookModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true, lean: true }
    ).select('-isDeleted -deletedAt -__v ');

    res.status(200).json({
      type: 'success',
      message: 'successfully updated book',
      data: book,
    });
  };
  /**
   * **Deleted one book**
   * - Grab `bookId` from query params
   * - Search for the book
   * - If no book found send an error otherwise
   * - Set `isDeleted` field to true
   * - Save the document and send a successfull response
   * @param req express request
   * @param res express responase
   */
  public deleteOneById: ApiRequestHandler<unknown, IResMessage, TBookParams> =
    async (req, res) => {
      const { id } = req.params;
      const book = await BookModel.findOne({ _id: id, isDeleted: false });
      if (!book) throw new Errors.NotFoundError('book not found');
      console.log(book);
      book.isDeleted = true;
      book.createdBy = getObjectIdFromString(req.user.userId);
      await book.save();
      res.status(200).json({
        type: 'success',
        message: 'successfully deleted product',
      });
    };
  /**
   *
   * @param req express request
   * @param res express responase
   */
  public imageUpload: ApiRequestHandler<
    unknown,
    IResMessage & { image: IUploadedImage }
  > = async (req, res) => {
    if (!req.file) throw new Errors.BadRequestError('No image file found');

    const image = await this.useImageUploadService.uploadToCloudinary(
      req.file.path,
      'book-management/book/covers'
    );

    res.status(200).json({
      type: 'success',
      message: 'image was uploaded successfully',
      image,
    });
  };
}

export default BookController;
