import { cleanEnv, num, port, str } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    PORT: port({ default: 5000 }),
    MONGO_DB_USER: str(),
    MONGO_DB_PWD: str(),
    MONGO_DB_PATH: str(),
    COOKIE_SECRET: str(),
    JWT_SECRET: str(),
    SMTP_HOST: str(),
    SMTP_PORT: port(),
    SMTP_TLS: str(),
    SMTP_USERNAME: str(),
    SMTP_PASSWORD: str(),
    SENDER_NAME: str(),
    SENDER_EMAIL: str(),
    CLOUDINARY_CLOUD_NAME: str(),
    CLOUDINARY_API_KEY: num(),
    CLOUDINARY_API_SECRET: str(),
  });
};

export default validateEnv;
