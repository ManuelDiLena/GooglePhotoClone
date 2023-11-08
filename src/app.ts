import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { join } from 'path';
import session from 'express-session';
import mongoose from 'mongoose';

export const app = express();

// Middleware configuration
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname, '../public')));
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
);

// Db connection configuration
const options: mongoose.ConnectOptions = {
    dbName: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    pass: process.env.DB_PASS as string,
};

(async () => {
    await mongoose.connect(process.env.DB_CONNECTION as string, options);
    console.log('Connecting to MongoDB...'); 
})();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});