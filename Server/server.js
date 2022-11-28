require('dotenv').config();
module.exports = async function (client) {
	require('dotenv').config();
	const express = require('express');
	const app = express();

	app.get('/', (req, res) => {
		res.send('Currently Working.');
	});
	app.listen(process.env.PORT);
};
