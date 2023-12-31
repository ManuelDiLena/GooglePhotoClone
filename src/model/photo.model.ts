import Mongoose from 'mongoose';

export interface IPhotoReq {
    ids: string;
    albumid: string;
};

export interface IPhotoFavReq {
    photoid: string;
    origin: string;
};

export interface IPhoto {
    _id?: string;
    filename: string;
    userid: string;
    size: number;
    mimeType: string;
    favorite: boolean;
    createdAt?: Date;
    albums: string[];
};

const PhotoSchema = new Mongoose.Schema({
    id: { type: Object },
    filename: { type: String, required: true },
    userid: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    favorite: { type: Boolean, required: true, default: false },
    albums: { type: Array, required: false, default: [] },
});

export default Mongoose.model('Photo', PhotoSchema);