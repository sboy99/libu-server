import type {
  IInitializeRoutes,
  IReturnsVoid,
} from '@/interfaces/app.interface';
import type IRoute from '@/interfaces/route.interface';
import type { Application } from 'express';

import { v2 as cloudinary } from 'cloudinary';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandling.middleware';
import routeNotFoundHandler from './middlewares/notFound.middleware';

class App {
  public express: Application;
  public port: number;

  constructor(routes: IRoute[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeConfigs();
    this.initializeSequrityPackages();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.enableUnknownRouteHandling();
    this.enableErrorHandling();
  }
  // initialize database
  private initializeDatabaseConnection: IReturnsVoid = () => {
    const { MONGO_DB_USER, MONGO_DB_PWD, MONGO_DB_PATH } = process.env;
    mongoose.set('strictQuery', false);
    mongoose
      .connect(
        `mongodb+srv://${MONGO_DB_USER as string}:${MONGO_DB_PWD as string}@${
          MONGO_DB_PATH as string
        }?retryWrites=true&w=majority`
      )
      .then(() => console.log(`connected to DB`))
      .catch((e) => console.log(e));
  };

  private initializeConfigs: IReturnsVoid = () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  };

  // initialize sequrity packages
  private initializeSequrityPackages: IReturnsVoid = () => {
    this.express.use(helmet());
    this.express.use(cors());
  };

  // initialize middlewares
  private initializeMiddlewares: IReturnsVoid = () => {
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(cookieParser(process.env.COOKIE_SECRET));
    this.express.use(compression());
  };

  // initialize routes
  private initializeRoutes: IInitializeRoutes = (routes) => {
    routes.forEach((route) => {
      this.express.use(`/api/v1${route.path}`, route.router);
    });
  };

  public enableUnknownRouteHandling: IReturnsVoid = () => {
    this.express.use(routeNotFoundHandler);
  };

  private enableErrorHandling: IReturnsVoid = () => {
    this.express.use(errorHandler);
  };

  // listen to server
  public listen: IReturnsVoid = () => {
    this.express.listen(this.port, () =>
      console.log(`Server is listening on port:${this.port}`)
    );
  };
}

export default App;
