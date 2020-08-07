require('dotenv').config();
const User = require('../models/user');
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: 'dzieidw6k',
	api_key: '353835745499585',
	api_secret: process.env.CLOUDINARY_SECRET
});

module.exports={
	landingPage(req, res, next) {
		res.render('index');
	},
	getRegister(req, res,next) {
		if(req.isAuthenticated()) return res.redirect('/');
		res.render('user/register');
	},
	getLogin(req, res, next) {
		if(req.isAuthenticated()) return res.redirect('/');
		res.render('user/login');
	},
	async postRegister(req, res, next) {
		try{
			let user= await User.register(new User(req.body),req.body.password);
			
			if (req.file) {
				let image = await cloudinary.v2.uploader.upload(req.file.path);
				user.image.secure_url=image.secure_url;
				user.image.public_id=image.public_id;
				user=await user.save();
			}
			req.login(user,function(err) {
			if (err) return next(err);
			//req.session.success=`Welcome to Surf Shop, ${user.username}!`;
			res.redirect('/');
		});
		} catch(err) {
			const {username, email}=req.body;
			let error = err.message;
	      	if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
	        	error = 'A user with the given email is already registered';
	      	}
	      	res.render('user/register');
		}	
	},
}