import HttpException from '@/utils/exceptions/http.exception';

class NotFoundError extends HttpException {
  constructor(message = 'Item not found') {
    super(400, message);
  }
}

export default NotFoundError;
