var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload=multer({'dest':'uploads/'});
const { asyncErrorHandler, isLoggedIn} = require('../middleware');
const { landingPage,
	getRegister,
	getLogin,
	postRegister,
	postLogin,
	getLoginOtp,
	putLoginOtp,
	getSetOtp,
	putSetOtp,
	getProfile,
	updateProfileImage
      } = require('../controllers');

/* GET home page. */
router.get('/',asyncErrorHandler(landingPage));

/*GET Register User */
router.get('/register',getRegister);

/* POST /register*/
router.post('/register' ,upload.single('image'),asyncErrorHandler(postRegister));

/*Login User */
router.get('/login',getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

/*Get Login Otp*/
router.get('/login-otp',getLoginOtp);

/*POST Login Otp*/
router.post('/login-otp',asyncErrorHandler(putLoginOtp));

/*Get SetOtp*/
router.get('/set-otp',getSetOtp);

/*POST SetOtp*/
router.post('/set-otp',asyncErrorHandler(putSetOtp));

/*GET Logout*/
router.get('/logout',(req,res,next) => {
  req.logout();
  res.redirect('/');
})

/*Get Profile*/
router.get('/profile', isLoggedIn,asyncErrorHandler(getProfile));

/*Change profile pic*/
router.post('/profile-image',isLoggedIn,upload.single('image'),asyncErrorHandler(updateProfileImage));


module.exports = router;
