import { cleanEnv, port, str } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    MONGO_DB_USER: str(),
    MONGO_DB_PWD: str(),
    MONGO_DB_PATH: str(),
    COOKIE_SECRET: str(),
    JWT_SECRET: str(),
    PORT: port({ default: 5000 }),
  });
};

export default validateEnv;
