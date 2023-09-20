const express = require('express');
const router = express.Router()
const multer = require('multer'); 
// const {logger, upload} = require('../Middlewares/middles')


const {showDashboard, createNewUser, deleteUser} = require('../Controllers/userControllers');



router.get('/addUser', showDashboard);

router.post('/addUser',  createNewUser);

router.delete('/deleteUser/:id',  deleteUser)







module.exports = router



