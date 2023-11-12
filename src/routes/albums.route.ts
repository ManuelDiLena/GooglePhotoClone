import express, { NextFunction, Request, Response } from 'express';
import Album, { IAlbum } from '../model/album.model';
import Photo, { IPhotoReq, IPhoto } from '../model/photo.model';

export const router = express.Router();

// Route to show all albums
router.get('/albums', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const albums = await Album.find({ userid: req.session.user._id! });
        res.render('albums/index', { user: req.session.user, albums });

    } catch (err) {

    }
});

// Route to view photos from a specific album
router.get('/albums/:id', async (req: Request, res: Response, next: NextFunction) => {
    const albumid = req.params.id;

    try {
        let photos = await Photo.find({
            albums: albumid,
        });

        let album = await Album.findById(albumid);

        if (album) {
            if (album.userid !== req.session.user._id && album.isprivate) {
                res.render('error/privacy', {});
                return;
            }
        }

        const albums = await Album.find({ userid: req.session.user._id! });

        res.render('albums/view', {
            user: req.session.user,
            photos,
            album,
            albums,
        });

    } catch (err) {
        console.log(err);
    }
});

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