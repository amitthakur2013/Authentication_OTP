const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema=mongoose.Schema;

const UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	image: {
		secure_url:{
			type:String,
			default:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTTO49Sf3eZSLGIoxoBKvCACPftwCzX8w0-yw&usqp=CAU'
		},
		public_id:String
	},
	age:{
		type:Number,
		min:1,
		required:true
	},
	phone:{
		type:Number,
		min: [10, 'Invalid phone number'],
		max: [10, 'Invalid phone number']
	},
	otp:String,
},{
	timestamps:true
});

UserSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('User',UserSchema) ;