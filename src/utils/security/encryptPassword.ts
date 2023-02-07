import bcryptjs from 'bcryptjs';

const encryptPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  const encryptedPwd = await bcryptjs.hash(password, salt);
  return encryptedPwd;
};

export default encryptPassword;
