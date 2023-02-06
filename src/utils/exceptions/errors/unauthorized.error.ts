import HttpException from '@/utils/exceptions/http.exception';

class UnauthorizedError extends HttpException {
  constructor(message = `Unauthorized to proceed further`) {
    super(401, message);
  }
}

export default UnauthorizedError;
