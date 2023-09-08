import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import searchRoutes from './routes/searchRoutes';
import resultsRoutes from './routes/resultsRoutes';
import authenticationMiddleware from './middlewares/authorization';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(authenticationMiddleware);

app.use('/api', searchRoutes);
app.use('/api', resultsRoutes);

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
