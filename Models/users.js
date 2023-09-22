const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    age: {
        type: Number,
        min: 0
    },
    salary: {
        type: Number,
        min: 0
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
    status: {
        type: String,
        enum: ['verified', 'notVerified'],
        required: true,
    },
    image: String,

})

usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(this.password, salt); 
        this.password = hashedPassword; 
        return next();
    } catch (error) {
        return next(error);
    }
});




module.exports = mongoose.model('User', usersSchema)