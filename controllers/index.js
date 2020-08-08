require('dotenv').config();
const User = require('../models/user');
const cloudinary = require('cloudinary');
const client=require('twilio')(process.env.ACCOUNTSID,process.env.AUTHTOKEN);
const util=require('util');

cloudinary.config({
	cloud_name: 'dzieidw6k',
	api_key: '353835745499585',
	api_secret: process.env.CLOUDINARY_SECRET
});

module.exports={
	async landingPage(req, res, next) {
		const {dbQuery}=res.locals;
		console.log(dbQuery);
		delete res.locals.dbQuery;
		if(dbQuery){
			const users=await User.find(dbQuery).sort('-_id').exec()
			res.render('index',{users});
		} else {
			const users=await User.find({}).sort('-_id').exec()
			res.render('index',{users});
		}
		
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
	async postLogin(req, res, next){
		const {username, password}=req.body;
		const {user, error}= await User.authenticate()(username, password);
		if(!user && error) return next(error);
		req.login(user, function(err) {
			if(err) return next(err);
			//req.session.success=`Welcome back, ${username}!`;
			const redirectUrl=req.session.redirectTo || '/';
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
		});
	},
	getLoginOtp(req, res, next) {
		if(req.isAuthenticated()) return res.redirect('/');
		res.render('user/login-otp');

	},
	putLoginOtp(req, res, next) {
		const {phone}=req.body;

		User.findOne({phone:phone})
		.then((user)=>{
			if(!user){
				const error=new Error('No user with given mobile no!!');
				return next(error);
			}
			client
			.verify
			.services(process.env.SERVICEID)
			.verifications
			.create({
				to:`+91${phone}`,
				channel:'sms'
			})
			.then((data) => {
				
				res.render('user/set-otp',{phone});

			})
			.catch(err=>next(err));
		})
		.catch(err => next(err));
	},
	getSetOtp(req, res, next) {
		if(req.isAuthenticated()) return res.redirect('/');
		res.render('user/set-otp');
	},
	putSetOtp(req,res,next) {
		const {otp}=req.body;
		const {phone}=req.query;
		client
			.verify
			.services(process.env.SERVICEID)
			.verificationChecks
			.create({
				to:`+91${phone}`,
				code:otp
			})
			.then(async (data) => {
				if(data.valid) {
					const user=await User.findOne({phone:phone})
					if(user) {
						const login=util.promisify(req.login.bind(req));
						await login(user);
						delete res.locals.phone;
						res.redirect('/');
					} else {
						next(new Error('User does not exist!'));
					}
				} else {
					next(new Error('Invalid OTP!'));
				}
			})
			.catch(err => next(err));
	},

	async getProfile(req, res, next) {
		const user=await User.findById(req.user._id)
		res.render('profile',{user});
	},

	async updateProfileImage(req, res, next) {
		const user=req.user;
		if(user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
		let image = await cloudinary.v2.uploader.upload(req.file.path);
		user.image.secure_url=image.secure_url;
		user.image.public_id=image.public_id;
		await user.save();
		res.redirect('/profile');

	},

}