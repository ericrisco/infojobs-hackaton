require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const connectDB = require('./db/db');

const startCommand = require('./bot/commands/start');
const errorCommand = require('./bot/commands/error');

app.get('/ping', (req, res) => {
	res.json({ success: true });
});

startCommand();
errorCommand();

app.listen(port, async () => {
	await connectDB();
	console.log(`Server running on http://localhost:${port}`);
});
