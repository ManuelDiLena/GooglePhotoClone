import express, { NextFunction, Request, Response } from 'express';
import Album, { IAlbum } from '../model/album.model';
import Photo, { IPhotoReq, IPhoto } from '../model/photo.model';

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

// Rute to change information
router.post('/update-photos', (req: Request, res: Response) => {});

// Routes to add and remove from favorites
router.post('/add-favorite', async (req: Request, res: Response) => {});

router.post('/remove-favorite', async (req: Request, res: Response) => {});

// Route to preview a photo
router.get('/view/:id', async (req: Request, res: Response, next: NextFunction) => {});

