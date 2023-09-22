const express = require('express');
const router = express.Router()
const multer = require('multer'); 
const {upload} = require('../Middlewares/middles')



const {showDashboard, createNewUser, sortByage, sortBysalary, search, searchUser, deleteUser, sendInfo, editUser, updatedUser} = require('../Controllers/userControllers');



router.get('/addUser', showDashboard);

router.post('/addUser', upload.single('image'), createNewUser);

router.get('/sortByAge', sortByage);

router.get('/sortBySalary', sortBysalary);

router.get('/search', search);

router.get('/searchUser', searchUser);

router.delete('/deleteUser/:id',  deleteUser);

router.get('/sendInfo/:id',  sendInfo);

router.get('/editUser', editUser);

router.post('/updatedUser', updatedUser);
  






module.exports = router



