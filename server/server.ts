import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import apiRoutes from './routes/index';

dotenv.config();

const app: Application = express();

app.use(cors({ origin: [`${process.env.FRONTEND_URI}`, "*"], credentials: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI as string)
   .then(() => console.log('MongoDB connected'))
   .catch((err: Error) => console.error('MongoDB connection error:', err));

app.use('/api', apiRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   console.error(err);
   res.status(500).send({ message: 'Something went wrong', error: err.message });
});

const PORT: number = Number(process.env.PORT) || 8080;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
