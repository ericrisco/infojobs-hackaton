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

cron.schedule('* 8 * * *', function() {
	console.log('Running cron job');
	dailyOffer();
});

app.get('/infojobs/ping', (req, res) => {
	res.json({ success: true });
});


app.listen(port, async () => {
	await connectDB();
	console.log(`Server running on http://localhost:${port}`);
});
