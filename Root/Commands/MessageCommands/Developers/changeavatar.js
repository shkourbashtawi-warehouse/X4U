module.exports = {
	name: 'changeavatar',
	category: 'Developers',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		if (!args[0]) return message.reply({ content: 'Type the avatar URL!' });
		try {
			await client.user.setAvatar(args[0]);
			await message.reply({ content: 'Done' });
		} catch (e) {
			message.reply({ content: `Error! ${e.message || e}` });
		}
	},
};
