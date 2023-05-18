const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	chatId: {
		type: Number,
		required: true,
		unique: true
	},
	firstName: String,
	lastName: String,
	aboutMe: String,
	age: Number,
	city: String,
	category: String,
	position: String,
	experienceYears: Number,
	remote: Boolean,
	others: String,
	other_city: Boolean,
	others_city: [String],
	recomendation: String,
	registeredAt: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
