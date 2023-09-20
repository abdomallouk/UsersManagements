const express = require('express');
const router = express.Router()
const multer = require('multer'); 
const {isAuthenticated} = require('../Middlewares/middles')


const {showLogin, verifyAccount} = require('../Controllers/userControllers');


router.get('/login',isAuthenticated, showLogin)

router.post('/login', verifyAccount)
 

module.exports = router




