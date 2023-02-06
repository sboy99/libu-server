import BadRequestError from '@/utils/exceptions/errors/badRequest.error';
import ForbiddenError from '@/utils/exceptions/errors/forbidden.error';
import NotFoundError from '@/utils/exceptions/errors/notFound.error';
import UnauthorizedError from '@/utils/exceptions/errors/unauthorized.error';

const Errors = {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};

export default Errors;
