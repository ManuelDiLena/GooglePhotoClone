import express, { NextFunction, Request, Response } from 'express';
import User from '../model/user.model';

export const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
    res.render('login/index');
});

router.get('/signup', (req: Request, res: Response) => {
    res.render('login/signup');
});

router.post('/auth', (req: Request, res: Response, next: NextFunction) => {});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.body.username, req.body.password, req.body.name);
    const { username, password, name }: {username: string, password:string, name: string} = req.body;

    if (!username || !password || !name) {
        console.log('Some field is missing');
        res.redirect('/signup');

    } else {
        const userProps = { username, password, name };
        const user = new User(userProps);

        const exists = await user.usernameExists(username);

        if (exists) res.redirect('/signup');

        await user.save();

        res.redirect('/login');
    }
});