import { NextFunction, Request, Response } from 'express';

// Middleware so that if you are not authenticated it redirects us to Login
export function middleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        next();

    } else {
        res.redirect('/login');
    }
};

// Middleware to redirect to Home if authenticated
export function middlewareHome(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        res.redirect('/home');

    } else {
        next();
    }
};