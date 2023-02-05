import HttpException from '@/utils/exceptions/http.exception';

class ForbiddenError extends HttpException {
  constructor(message = `Don't have permission to access`) {
    super(400, message);
  }
}

export default ForbiddenError;
