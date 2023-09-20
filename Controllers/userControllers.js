
const { body, validationResult } = require('express-validator');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const User = require('../Models/users')




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
  
  const { name, email, age, salary } = req.body;

  const newUser  = {
    name,
    email,
    age,
    salary
  }
  
  const user = new User(newUser)
  
  user.save()

  res.redirect('addUser')
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
  
  


