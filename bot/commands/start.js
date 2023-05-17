const util = require('util');
const User = require('../../db/models/user');
const messages = require('../../language/messages.json');

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const { first_name, last_name } = msg.from;

        User.findOne({ chatId })
            .then((user) => {
                if (user) {
                    const welcomeBackMessage = user.firstName === '' ? messages.welcomeBackNoName : util.format(messages.welcomeBack, user.firstName);          
                    bot.sendMessage(
                        chatId,welcomeBackMessage
                    );
                } else {
                    const newUser = new User({
                        chatId,
                        firstName: first_name,
                        lastName: last_name,
                    });
                    newUser
                        .save()
                        .then(() => {
                            bot.sendMessage(
                                chatId,
                                messages.welcomeNew
                            );
                            bot.sendMessage(chatId, messages.giveMeInfo).then(() => {
                                bot.sendMessage(chatId, messages.exampleProfile);
                                bot.on('message', (msg) => {
                                  if (msg.text) {
                                    User.findOneAndUpdate({ chatId }, { aboutMe: msg.text })
                                      .then(() => {
                                        bot.sendMessage(chatId, messages.thanksForInfo);
                                      })
                                      .catch((err) => {
                                        bot.sendMessage(
                                            chatId,
                                            messages.errorMessage
                                        );
                                        console.error(err);
                                      });
                                  }
                                });
                            });
                        })
                        .catch((err) => {
                            console.error(err);
                            bot.sendMessage(
                                chatId,
                                messages.errorMessage
                            );
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                bot.sendMessage(
                    chatId,
                    messages.errorMessage
                );
            });
    });
};
