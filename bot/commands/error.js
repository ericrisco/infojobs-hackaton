const bot = require('../bot');
module.exports = () => {
	bot.on('polling_error', (error) => {
		console.log(error);
	});
};
