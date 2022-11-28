module.exports = {
	name: 'devslash',
	category: 'Developers',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		if (args[0] === 'list') {
			const command = await client.application.commands.fetch().then((c) => c.map((cmd) => `${cmd.name} | ${cmd.id}`));
			console.log(command);
			message.reply(`See Console`);
		}

		if (args[0] === 'delete') {
			await client.application.commands.delete(`${args[1]}`);
			message.reply(`Command has been deleted.`);
		}

		if (args[0] === 'add') {
			const cmd = client.commands.slashCommands.get(`${args[1]}`);
			await client.application.commands.create({
				name: cmd.name,
				description: cmd.description ?? 'None',
				options: cmd.options ?? [],
				type: cmd.type ?? 'CHAT_INPUT',
			});
			message.reply(`Command has been added.`);
		}
	},
};
