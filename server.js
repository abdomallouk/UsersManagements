
require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const cookies = require('cookie-parser')
const connectdb = require('./db/connectdb')

const registerRouter = require('./Routes/register')
const loginRouter = require('./Routes/login')
const usersRouter = require('./Routes/users')



app.set('view engine', 'ejs');



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname+'uploads'))
app.use(cookies())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/', registerRouter)


app.use('/', loginRouter)


app.use('/', usersRouter)













const port = process.env.PORT || 6500;
const start = async () => {
    try{
        await connectdb(process.env.MONGO_URI);
        app.listen(port, (req, res) => {
            console.log(`Connecting to DB, and listening on port: ${port}`);
        })
    }catch(e){
        console.log(e);
    }
}
start();
