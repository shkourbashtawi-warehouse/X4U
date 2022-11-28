module.exports = {
	name: 'roll',
	description: 'send random number (1-999).',
	usage: ['roll'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		let Number = Math.floor(Math.random() * 999) + 1;
		interaction.reply({ content: `> ${Number}` });
	},
};
