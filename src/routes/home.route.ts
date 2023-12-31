import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import Photo from '../model/photo.model';
import Album from '../model/album.model';

// Function to store the photos that are uploaded
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '.' + ext[ext.length - 1]);
    },
});

const upload = multer({ storage: storage });

export const router = express.Router();

import { middleware } from '../middleware/auth.middleware';

// Route to show the home page
router.get('/home', middleware, async (req: Request, res: Response) => {
    try {
        const photos = await Photo.find({ userid: req.session.user._id! });
        const albums = await Album.find({ userid: req.session.user._id! });
        res.render('home/index', { user: req.session.user, photos, albums });

    } catch (err) {
        res.render('home/index', { user: req.session.user });

    } 
});

// Route to upload and save a new photo
router.post('/upload', upload.single('photos'), (req: Request, res: Response) => {
    const file = req.file!;

    const photoProps = {
        filename: file.filename,
        mimeType: file.mimetype,
        userid: req.session.user._id!,
        size: file.size,
        createdAt: new Date(),
        favorite: false,
        albums: [],
    };

    const photo = new Photo(photoProps);
    photo.save();

    res.redirect('/home');
});
