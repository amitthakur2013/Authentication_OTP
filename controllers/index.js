const User = require('../models/user');
module.exports={
	landingPage(req, res, next) {
		res.render('index');
	},
	getRegister(req, res,next) {
		res.render('user/register');
	},
	getLogin(req, res, next) {
		res.render('user/login');
	}
}