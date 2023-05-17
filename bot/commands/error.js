module.exports = (bot) => {
    bot.on('polling_error', (error) => {
        console.log(error);
    });
};
