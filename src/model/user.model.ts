import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Mongoose.Schema({
    id: { type: Object },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
});

// Password encrypt function
UserSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        const document = this;

        bcrypt.hash(document.password, 10, (err, hash) => {
            if (err) return next(err);
            document.password = hash;
            next();
        });
    } else {
        next();
    }
});

// Function to detect if the username already exists
UserSchema.methods.usernameExists = async function (username):Promise<boolean> {
    let result = await Mongoose.model('User').find({ username: username });

    return result.length > 0;
};

// Function that identifies if the user and pass are correct
UserSchema.methods.isCorrectPassword = async function (password, hash):Promise<boolean> {
    console.log(password, hash);
    const same = await bcrypt.compare(password, hash);

    return same;
};

export default Mongoose.model('User', UserSchema);