
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const User = require('../Models/users');
require("dotenv").config();

const nodemailer = require("nodemailer"); 

// const emailS = require('emailjs')




exports.showRegister = (req, res) => {
    res.render('userLogin'); 
  }



exports.verifyUser = async(req, res) => {

  const {email, password}  = req.body;

  console.log(email)
  console.log(password)


  try {

    const selectedUser = await User.findOne({email: email})

    console.log(selectedUser)

    if(!selectedUser) {
      return res.status(404).send('User not found');
    } 

    const userRole = selectedUser.role
    const userStatus = selectedUser.status

    console.log(userRole)
    console.log(userStatus)

    if(userRole === 'user' && userStatus ==='verified') {
      res.render('vUserDashboard', {selectedUser})
      // res.redirect('/vUserDashboard')
    } else if (userRole === 'user' && userStatus ==='notVerified') {
      res.render('notVuserDashboard', {selectedUser})
    } else if (userRole === 'admin' && userStatus ==='verified') {
      res.redirect('/addUser')
    } else if (userRole === 'admin' && userStatus ==='notVerified') {
      res.render('notVadminDashboard', {selectedUser})
    }

     
  } catch (error) {
    console.error('Error finding User:', error);
    res.status(500).send('Internal Server Error');
  }
  

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

  console.log(userEmail)
  console.log(userPassword)


  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "malloukab77@gmail.com",
    subject: "Your Account Information",
    // text: `Hello,\n\nYour email: ${userEmail}\nYour hashed password: ${userPassword}\n\nThank you.`,
    html: `
    <html>
      <body>
        <p>Hello,</p>
        <p>Your email: ${userEmail}</p>
        <p>Your hashed password: ${userPassword}</p>
        <p>Thank you.</p>
        <a href="http://localhost:6500/userLogin" id="myProfile"> Go to my  Profile</a>
      </body>
    </html>
  `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent successfully:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });

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













 // const server = emailS.server.connect({
  //   user: process.env.user,
  //   password: process.env.password,
  //   host: process.env.host,
  //   ssl: process.env.ssl,
  // });
  
  
  
  // const sendEmail = (userEmail, hashedPassword) => {
  //   const message = {
  //     text: `Hello,\n\nYour email: ${userEmail}\nYour hashed password: ${hashedPassword}\n\nThank you.`,
  //     from: process.env.user,
  //     to: 'mallloukab77@gmail.com',
  //     subject: 'Your Account Information',
  //   };
  
  //   server.send(message, (err, message) => {
  //     if (err) {
  //       console.error('Error sending email:', err);
  //     } else {
  //       console.log('Email sent successfully:', message);
  //     }
  //   });
  // };
  

  // sendEmail(userEmail, userPassword);