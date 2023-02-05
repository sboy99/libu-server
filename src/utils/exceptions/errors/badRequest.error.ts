import HttpException from '@/utils/exceptions/http.exception';

class BadRequestError extends HttpException {
  constructor(message = 'Its a bad request') {
    super(400, message);
  }
}

export default BadRequestError;
