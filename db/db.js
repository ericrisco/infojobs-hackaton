const mongoose = require('mongoose');

const connectDB = async () => {
	let dbUrl = process.env.MONGODB_URI;
	dbUrl = dbUrl.replace('<username>', process.env.MONGODB_USERNAME).replace('<password>', process.env.MONGODB_PASSWORD);
	try {
		mongoose.set('strictQuery', false);
		await mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});
		console.log('MongoDB connection SUCCESS');
	} catch (error) {
		console.log(error);
		console.error('MongoDB connection FAIL');
		process.exit(1);
	}
};

module.exports = connectDB;
