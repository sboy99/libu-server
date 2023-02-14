import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import type IResMessage from '@/interfaces/responseMessage.interface';
import Errors from '@/utils/exceptions/errors';
import getObjectIdFromString from '@/utils/getObjectIdFromString';
import type {
  IAdditonalReviewFields,
  TCreateReview,
  TReviewDocument,
  TReviewParams,
  TReviewQuery,
  TUpdateReview,
} from './review.interface';
import ReviewModel from './review.model';

class ReviewController {
  private db = ReviewModel;

  /**
   * **Create a review on a book**
   * - Grab `bookId` & `userId` from request
   * - Search for a review if found send bad request else
   * - Create a review
   * @param req express request
   * @param res express response
   */
  public create: ApiRequestHandler<
    TCreateReview & IAdditonalReviewFields,
    IResMessage & { data: TReviewDocument },
    Pick<TReviewParams, 'bookId'>
  > = async (req, res) => {
    const { bookId } = req.params;
    const { userId } = req.user;

    // todo: search for the book in db if bood does not exist throw error

    const isReviewWritten = await this.db.findOne({
      bookId,
      reviewedBy: userId,
    });

    if (isReviewWritten)
      throw new Errors.BadRequestError('One user should write one review');

    req.body.bookId = bookId;
    req.body.reviewedBy = getObjectIdFromString(userId);
    const review = await this.db.create(req.body);
    res.status(200).json({
      type: 'success',
      message: 'Thank you for your review',
      data: review,
    });
  };
  /**
   * **Reads all reviews based on book id**
   * - Destructure `bookId` from request params
   * - Search reviews from db that matches `bookId` make sure `isDeleted` false also popuate user data
   * - Send a successfull response to client
   * @param req express request
   * @param res express response
   */
  public readAll: ApiRequestHandler<
    unknown,
    IResMessage & {
      count: number;
      data: TReviewDocument[];
    },
    Pick<TReviewParams, 'bookId'>,
    TReviewQuery
  > = async (req, res) => {
    const { select, sort, limit, page } = req.query;
    const query = {
      select: select ?? '-isDeleted -updatedAt -__v -bookId',
      sort: sort ?? 'cratedAt ratings',
      skip: (page - 1) * limit,
    };

    const { bookId } = req.params;
    const reviews = await this.db
      .find({ bookId, isDeleted: false })
      .select(query.select)
      .sort(query.sort)
      .limit(limit)
      .skip(query.skip)
      .populate('reviewedBy', 'name avatar email -_id');

    res.status(200).json({
      type: 'success',
      message: 'success found documents',
      count: reviews.length,
      data: reviews,
    });
  };
  /**
   * **Reads a specific book review from db and returns that**
   * - Grabs `bookId` & `reviewId` from params
   * - Seaches for a document that matches `bookId` & `reviewId` and not deleted yet
   * - If no such documents found thows an exception otherwise
   * - Send a successfull response with data
   * @param req express request
   * @param res express response
   */
  public readOneById: ApiRequestHandler<
    unknown,
    IResMessage & { data: TReviewDocument },
    TReviewParams
  > = async (req, res) => {
    const { bookId, reviewId } = req.params;
    const bookReview = await this.db
      .findOne({ bookId, _id: reviewId, isDeleted: false })
      .select('-isDeleted -__v')
      .populate('reviewedBy', 'name avatar email -_id');
    if (!bookReview) throw new Errors.NotFoundError('Review not Found');
    res.status(200).json({
      type: 'success',
      message: 'Successfully found book review',
      data: bookReview,
    });
  };
  /**
   * **Updates an existing review by inserting a new one**
   * - Get `userId`, `bookId` and `reviewId`
   * - Search for book is exist or not
   * - If book does not exist send a not found exception otherwise
   * - Search for the review using bookId, userId & reviewId and not deleted one
   * - Update the stack for the review
   * - Send a success response to the client
   * @param req express request
   * @param res express response
   */
  public updateOneById: ApiRequestHandler<
    TUpdateReview,
    IResMessage & { data: TReviewDocument },
    TReviewParams
  > = async (req, res) => {
    const { bookId, reviewId } = req.params;
    const { userId } = req.user;
    const bookReview = await this.db.findOne({
      bookId,
      reviewedBy: userId,
      _id: reviewId,
      isDeleted: false,
    });
    if (!bookReview) throw new Errors.NotFoundError('Review not found');

    if (req.body.reviews && req.body.reviews.length > 0) {
      const incomingReview = req.body.reviews[0];
      if (bookReview.reviews) {
        if (bookReview.reviews.length > 0) {
          const lastReview = bookReview.reviews[bookReview.reviews.length - 1];
          if (
            lastReview.title !== incomingReview.title ||
            lastReview.comment !== incomingReview.comment
          ) {
            bookReview.reviews.push(incomingReview);
          }
        } else {
          bookReview.reviews.push(incomingReview);
        }
      }
    }
    if (req.body.ratings !== undefined) {
      bookReview.ratings = req.body.ratings;
    }
    const mReview = await bookReview.save();
    res.status(200).json({
      type: 'success',
      message: 'successfully updated review',
      data: mReview,
    });
  };
  /**
   * **Deletes a book**
   * - Grabs `bookId` & `reviewId` from params
   * - Searches for a book that matches `bookId` & `reviewId` and not deleted yet
   * - If no such book is found send exception otherwise
   * - Set `isDelete` to `true` & save the document
   * - Send a success response
   * @param req express request
   * @param res express response
   */
  public deleteOneById: ApiRequestHandler<unknown, IResMessage, TReviewParams> =
    async (req, res) => {
      const { bookId, reviewId } = req.params;
      const bookReview = await this.db.findOne({
        bookId,
        _id: reviewId,
        isDeleted: false,
      });
      if (!bookReview) throw new Errors.NotFoundError('Book not found');
      bookReview.isDeleted = true;
      await bookReview.save();
      res.status(200).json({
        type: 'success',
        message: 'review deleted successfully',
      });
    };
}

export default ReviewController;
