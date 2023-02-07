import bcryptjs from 'bcryptjs';

const verifyPassword = async (
  currPassword: string,
  regPassword: string
): Promise<boolean> => {
  return await bcryptjs.compare(currPassword, regPassword);
};

export default verifyPassword;
