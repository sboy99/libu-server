import type ApiRequestHandler from '@/interfaces/apiRequestHandler.interface';
import BookModel from './book.model';

class BookController {
  private db = BookModel;

  /**
   *
   * @param req express request
   * @param res express responase
   */
  public create: ApiRequestHandler = (req, res) => {
    res.send('Book created');
  };
  /**
   *
   * @param req express request
   * @param res express responase
   */
  public readAll: ApiRequestHandler = (req, res) => {
    res.send('All book read ');
  };
  /**
   *
   * @param req express request
   * @param res express responase
   */
  public readOneById: ApiRequestHandler = (req, res) => {
    res.send('Read one book');
  };
  /**
   *
   * @param req express request
   * @param res express responase
   */
  public updateOneById: ApiRequestHandler = (req, res) => {
    res.send('Update one book');
  };
  /**
   *
   * @param req express request
   * @param res express responase
   */
  public deleteOneById: ApiRequestHandler = (req, res) => {
    res.send('Delete one book');
  };
}

export default BookController;
