import express, { NextFunction, Request, Response } from 'express';
import Album, { IAlbum } from '../model/album.model';
import Photo, { IPhotoReq, IPhotoFavReq, IPhoto } from '../model/photo.model';

export const router = express.Router();

// Route to add a photo to an album
router.post('/add-to-album', async (req: Request, res: Response) => {
    const { ids, albumid }: IPhotoReq = req.body;

    const idPhotos = ids.split(',');

    const promises = [];

    for (let i = 0; i < idPhotos.length; i++) {
        promises.push(
            Photo.findByIdAndUpdate(idPhotos[i], {
                $push: { albums: albumid as any },
            })
        );
    }

    await Promise.all(promises);

    res.redirect('/home');
});

// Routes to add and remove from favorites
router.post('/add-favorite', async (req: Request, res: Response) => {
    const { photoid, origin }: IPhotoFavReq = req.body;

    try {
        await Photo.findByIdAndUpdate(photoid, {
            $set: { favorite: true as any },
        });

        res.redirect(origin);

    } catch (err) {}
});

router.post('/remove-favorite', async (req: Request, res: Response) => {
    const { photoid, origin }: IPhotoFavReq = req.body;

    try {
        await Photo.findByIdAndUpdate(photoid, {
            $set: { favorite: false as any },
        });

        res.redirect(origin);

    } catch (err) {}
});

// Route to preview a photo
router.get('/view/:id', async (req: Request, res: Response, next: NextFunction) => {
    const photoid = req.params.id as string;
    const origin = req.query.origin as string;

    try {
        const photo = await Photo.findById(photoid);
        const albums = await Album.find({ userid: req.session.user._id! });

        res.render('layout/preview', {
            user: req.session.user,
            photo,
            albums,
            origin,
        });

    } catch (err) {
        console.log(err);
    }
});

