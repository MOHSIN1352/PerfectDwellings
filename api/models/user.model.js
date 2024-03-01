import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default:"https://sportshub.cbsistatic.com/i/2023/08/15/d6059664-fb2e-4d86-9456-4c38ca11c60a/one-piece-episode-1070-gear-5-luffy-anime.jpg"
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
