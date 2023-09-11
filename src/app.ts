import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import searchRoutes from './routes/searchRoutes';
import resultsRoutes from './routes/resultsRoutes';
import exportRoutes from './routes/exportRoutes';
import authenticationMiddleware from './middlewares/authorization';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', authenticationMiddleware, searchRoutes);
app.use('/api', authenticationMiddleware, resultsRoutes);
app.use('/api', authenticationMiddleware, exportRoutes);

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
