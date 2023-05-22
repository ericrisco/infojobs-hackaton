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
	keywords: String,
	other_city: Boolean,
	others_city: [String],
	score: Number,
	recomendation: String,
	availableForJobSearch: {
		type: Boolean,
		default: false
	},
	canSendDailyJobOffers: {
		type: Boolean,
		default: true
	},
	registeredAt: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
