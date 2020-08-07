var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload=multer({'dest':'uploads/'});
const { asyncErrorHandler} = require('../middleware');
const { landingPage,
	getRegister,
	getLogin,
	postRegister
      } = require('../controllers');

/* GET home page. */
router.get('/',asyncErrorHandler(landingPage));

/*GET Register User */
router.get('/register',getRegister);

/* POST /register*/
router.post('/register' ,upload.single('image'),asyncErrorHandler(postRegister));

/*Login User */
router.get('/login',getLogin);

/*GET Logout*/
router.get('/logout',(req,res,next) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;
