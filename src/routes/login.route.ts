import express, { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../model/user.model';

export const router = express.Router();

router.get('/login', (req: Request, res: Response) => {
    res.render('login/index');
});

router.get('/signup', (req: Request, res: Response) => {
    res.render('login/signup');
});

// Route to authenticate in the app
router.post('/auth', async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: IUser = req.body;

    if (!username || !password) {
        console.log('A field is missing');
        res.redirect('/login');

    } else {
        try {
            const user = new User();
            const userExists = await user.usernameExists(username);

            if (userExists) {
                const userFound = await User.findOne({ username: username });

                if (userFound) {
                    const passCorrect = await user.isCorrectPassword(
                        password,
                        userFound.password
                    );
    
                    if (passCorrect) {
                        req.session.user = userFound;
                        res.redirect('/home');
    
                    } else {
                        return next(new Error('Username and/or password incorrect'));
                    }
                }

            } else {
                return next(new Error('User does not exist'));
            }

        } catch (err) {
            res.redirect('/login');
        }
    }
});

// Route to register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {

    //console.log(req.body.username, req.body.password, req.body.name);
    const { username, password, name }: IUser = req.body;

    if (!username || !password || !name) {
        console.log('Some field is missing');
        res.redirect('/signup');

    } else {
        const userProps = { username, password, name };
        const user = new User(userProps);

        try {
            const exists = await user.usernameExists(username);

            if (exists) res.redirect('/signup');

            await user.save();

        } catch (err) {
            res.redirect('/login');
        }
    }
});