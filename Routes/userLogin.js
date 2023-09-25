const express = require('express');
const router = express.Router()
const multer = require('multer'); 
const {upload, isAuthenticated} = require('../Middlewares/middles')


const {showRegister, verifyUser, showvUserDashboard} = require('../Controllers/userControllers');
const { verify } = require('jsonwebtoken');



router.get('/userLogin', showRegister);


router.post('/userLogin', verifyUser);




module.exports = router
