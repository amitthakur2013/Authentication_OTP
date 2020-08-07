var express = require('express');
var router = express.Router();
const { asyncErrorHandler} = require('../middleware');
const { landingPage,
	getRegister,
	getLogin
      } = require('../controllers');

/* GET home page. */
router.get('/',asyncErrorHandler(landingPage));

/*Register User */
router.get('/register',getRegister);

/*Login User */
router.get('/login',getLogin);

module.exports = router;
