const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    salary: Number
})


module.exports = mongoose.model('User', usersSchema)