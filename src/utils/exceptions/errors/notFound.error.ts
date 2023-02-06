import HttpException from '@/utils/exceptions/http.exception';

class NotFoundError extends HttpException {
  constructor(message = 'Item not found') {
    super(404, message);
  }
}

export default NotFoundError;
