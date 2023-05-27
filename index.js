require('dotenv').config();
const express = require('express');
const cron = require('node-cron');

const app = express();

const port = process.env.PORT || 3000;

const connectDB = require('./db/db');

const startCommand = require('./bot/commands/start');
const onMessage = require('./bot/onMessage');
const errorCommand = require('./bot/commands/error');
const dailyOffer = require('./cron/cron');

startCommand();
onMessage();
errorCommand();

cron.schedule('0 9 * * *', function () {
	console.log('Running cron job');
	dailyOffer();
});

app.get('/infojobs/ping', (req, res) => {	
	res.json({ success: true });
});

app.get('/infojobs/callback', async (req, res) => {
    const {params} = new URL(req.url)
    const code = params.get("code");
	const chatId = params.get("chatId");
	res.json({ code, chatId });
});

app.listen(port, async () => {
	console.log(`Server running on http://localhost:${port}`);
	await connectDB();
});
