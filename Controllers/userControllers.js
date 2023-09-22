
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const User = require('../Models/users');
require("dotenv").config();

// const emailS = require('emailjs')




exports.showRegister = (req, res) => {
    res.render('register'); 
  }



exports.createAccount = (req, res) => {

    const errors = validationResult(req);
    
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
  
      if (!req.body.name) {
          return res.status(400).json({
              error: ' your data is not valid'
          })
      }
    
      const { name, email, password } = req.body;
  
  
      const imagePath = `/uploads/${req.file.filename}`; 
  
      const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          imagePath, 
      };
  
      const sanitizedData = {
        name: xss(name),
        email: xss(email),
        password: xss(password),
      };
  
      axios.post('http://localhost:3000/users', newUser)
  
      res.redirect('/login')
  
}



exports.showLogin = (req, res) => {
    res.render('login')
}


exports.verifyAccount =  async (req, res) => {

    const {name, password}  = req.body;
  
    try {
  
      const response = await axios.get('http://localhost:3000/users', {
        params: {
          name,
          password,
        },
      });
      
      const users = response.data;
    
      const user = users.find((user) => user.name === name && user.password === password);
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }
  
      const token = jwt.sign({ name: user.name ,image: user.imagePath}, "strongSecret");
      res.cookie("token",token,{
          httpOnly:true
      })
      res.redirect('/addBlog')  
    }
    catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  
}




exports.showDashboard =  async(req, res) => {
  const allUsers = await User.find()

  // console.log(allUsers)


  res.render('addUser', {allUsers} );
}



exports.createNewUser =  (req, res) => {
  
  const { name, email, age, salary, password, role, status } = req.body;

  const image =  `/uploads/${req.file.filename}`; 

  const newUser  = {
    name,
    email,
    age,
    salary,
    password,
    role,
    status,
    image,
  }
  
  const user = new User(newUser)
  
  user.save()

  res.redirect('/addUser')
}



exports.sortByage = async(req, res) => {

  try {
    const allUsers = await User.find().sort({age: -1});

    res.render('SortByAge', {allUsers} );
  } catch (error) {
    console.error('Error fetching sorted users:', error);
    res.status(500).send('Internal Server Error');
  }

}


exports.sortBysalary =  async(req, res) => {

  try {
    const allUsers = await User.find().sort({salary: -1});

    res.render('SortBySalary', {allUsers} );
  } catch (error) {
    console.error('Error fetching sorted users:', error);
    res.status(500).send('Internal Server Error');
  }

}



exports.search = (req, res) => {
  res.render('search')
}


exports.searchUser = async (req, res) => {

   try {
      const searchQuery = req.query.query;

      // console.log(searchQuery)

      const searchedUser = await User.find({ name: searchQuery })

      console.log(searchedUser)

      // res.render('search', {searchedUser} );


  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).send('Internal Server Error');
  }
}




exports.deleteUser = async (req, res) => {

  const userId = req.params.id;

  // console.log(userId)
  
  try {
    const deletedDocument = await User.findOneAndDelete({ _id: userId });

    if (!deletedDocument) {
      return res.status(404).send('User not found');
    }
    

    console.log('Deleted Document:', deletedDocument); 

    res.redirect('/addUser')
  
  } catch (error) {
    console.error('Error deleting User:', error);
    res.status(500).send('Internal Server Error');
  }
  
}
  




exports.sendInfo = async(req, res) => {

  const userId = req.params.id;

  // console.log(userId)

  const oneUser = await User.findOne({_id: userId})

  const userEmail = oneUser.email
  const userPassword = oneUser.password



  const server = emailS.server.connect({
    user: process.env.user,
    password: process.env.password,
    host: process.env.host,
    ssl: process.env.ssl,
  });
  
  
  
  const sendEmail = (userEmail, hashedPassword) => {
    const message = {
      text: `Hello,\n\nYour email: ${userEmail}\nYour hashed password: ${hashedPassword}\n\nThank you.`,
      from: process.env.user,
      to: 'mallloukab77@gmail.com',
      subject: 'Your Account Information',
    };
  
    server.send(message, (err, message) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', message);
      }
    });
  };
  

  sendEmail(userEmail, userPassword);

}






exports.editUser =  async(req, res) => {
    const userId = req.query.id;

    const oneUser = await User.findOne({_id: userId})


    // console.log(oneUser)
  
    res.render('oneUser', {oneUser});
}
  


exports.updatedUser = async(req, res) =>{

  const userId = req.query.id;

  const { name, email, age, salary } = req.body;

  const updatedUser = {
    name,
    email,
    age,
    salary
  }

   
  try {
    const updatedDocument = await User.findOneAndUpdate({_id: userId}, updatedUser, { new: true});

    if (!updatedDocument) {
      return res.status(404).send('User not found');
    }
    

    console.log('Updated Document:', updatedDocument); 

    res.redirect('/addUser')
  
  } catch (error) {
    console.error('Error deleting User:', error);
    res.status(500).send('Internal Server Error');
  }

}


