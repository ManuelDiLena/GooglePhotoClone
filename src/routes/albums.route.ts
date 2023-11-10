import express, { NextFunction, Request, Response } from 'express';
import Album, { IAlbum } from '../model/album.model';

export const router = express.Router();

// Route to show all albums
router.get('/albums', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const albums = await Album.find({ userid: req.session.user._id });
        res.render('albums/index', { user: req.session.user, albums });

    } catch (err) {

    }
});

// Route to view photos from a specific algum
router.get('/albums/:id', (req: Request, res: Response, next: NextFunction) => {});

// Route to create a new album in the DB
router.post('/create-album', async (req: Request, res: Response, next: NextFunction) => {
    const { name, isprivate }: { name: string; isprivate: string } = req.body;

    const albumProps: IAlbum = {
        name: name,
        userid: req.session.user._id!,
        isprivate: isprivate === 'on',
        createdAt: new Date(),
    };

    try {
        const album = await new Album(albumProps);
        album.save();
        res.redirect('/albums');

    } catch (err) {

    };
});