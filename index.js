require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const url = require('url');

const app = express();

const port = process.env.PORT || 3000;

const connectDB = require('./db/db');

const startCommand = require('./bot/commands/start');
const onMessage = require('./bot/onMessage');
const errorCommand = require('./bot/commands/error');
const dailyOffer = require('./cron/cron');
const { remoteProfile } = require('./bot/commands/profile');
const aboutMe = require('./bot/commands/aboutme');

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
	const queryObject = url.parse(req.url,true).query;
	const code = queryObject.code;
	const state = queryObject.state;
	const profile = await remoteProfile(state, code);
	await aboutMe(state, JSON.stringify(profile));
	res.send(`
		<html>
			<head>
				<script>
					window.close();
				</script>
			</head>
			<body>
			</body>
		</html>
	`);
});

app.listen(port, async () => {
	console.log(`Server running on http://localhost:${port}`);
	await connectDB();
});
