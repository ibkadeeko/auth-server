import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { errorHandler, successResponse } from '../middlewares/responseHandlers';
import { NotFoundError } from '../middlewares/errors';

const app = express();

app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) =>
  successResponse(res, "Welcome to Ibukun's Authentication Service", 200)
);

app.all('*', (req, res, next) => {
  throw new NotFoundError('The Route you are requesting for does not exist');
});

app.use(errorHandler);

export default app;
