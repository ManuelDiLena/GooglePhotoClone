import express, { NextFunction, Request, Response } from 'express';

export const router = express.Router();

router.get('/home', (req: Request, res: Response) => {
    res.render('home/index');
})
