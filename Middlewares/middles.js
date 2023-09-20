
const jwt = require('jsonwebtoken');
const multer = require('multer'); 



exports.logger = (req,res,next)=>{
    const token = req.cookies.token
  
    try{
        const verify_token = jwt.verify(token,"strongSecret")
        // console.log('token',verify_token)
        const {name,iat,image} = verify_token
        req.name = name
        req.iat = iat
        req.image = image
        next()
  
    }catch{
        res.status(401).send('invalid credentials ')
    }
}


exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
  
    try {
        const verify_token = jwt.verify(token, "strongSecret");
        res.redirect('/addBlog');

    } catch {
        next();
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

exports.upload = multer({ storage: storage })



