const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    firstName: String,
    lastName: String,
    aboutMe: String,
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
