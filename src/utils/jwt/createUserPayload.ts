import type { CreateUserPayload } from '@/interfaces/app.interface';

const createUserPayload: CreateUserPayload = (user, refreshToken) => {
  return {
    role: user.role,
    userId: String(user._id),
    userName: user.name,
    refreshToken,
  };
};

export default createUserPayload;
