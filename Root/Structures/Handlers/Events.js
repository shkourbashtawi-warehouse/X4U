const fs = require('fs');
const Filer = require('../../Utils/Filer.js');
const Discord = require('discord.js');
const { path, config, dataid } = require('../../../bot');
module.exports = async function (client) {
	const container = {
		RootPath: path,
		Config: config,
		Discord: Discord,
		DataID: dataid,
	};
	Filer(`${container.RootPath}/Root/Events`, async function (err, res) {
		res.forEach((file) => {
			if (fs.statSync(file).isDirectory()) return;
			const event = require(file);
			if (event.ignoreFile) return;
			if (event.customEvent) event.run(client, container);
			client.events.set(event.name, event);

			if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
			else client.on(event.name, (...args) => event.run(...args, client, container));
		});
	});
};
