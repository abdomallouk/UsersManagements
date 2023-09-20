const express = require('express');
const router = express.Router()
const multer = require('multer'); 
const {upload, isAuthenticated} = require('../Middlewares/middles')


const {createAccount, showRegister} = require('../Controllers/userControllers');



router.get('/register',isAuthenticated, showRegister);


router.post('/register',upload.single('image'), createAccount);



module.exports = router
