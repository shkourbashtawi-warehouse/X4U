const { Util } = require('discord.js');
module.exports = {
	name: 'emoji-links',
	description: 'Show an emoji URL.',
	usage: ['emoji-links [first] <second> <third> ...<tenth>'],
	category: 'Utility',
	cooldown: 5,
	clientPermissions: [
		'EMBED_LINKS',
		'SEND_MESSAGES',
		'USE_EXTERNAL_EMOJIS',
		'ATTACH_FILES',
		'MANAGE_EMOJIS_AND_STICKERS',
	],
	options: [
		{
			name: 'first',
			description: 'The first emoji',
			type: 3,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		try {
			var args = [];

			if (interaction.options.getString('first')) {
				let first = interaction.options.getString('first');
				let regex = /<:(.*?):([0-9]+)>/g;
				while ((match = regex.exec(first)) !== null) {
					args.push(match[0]);
				}
				if (args.length >= 4) {
					const embed = new container.Discord.MessageEmbed()
						.setColor(client.embed.color.red)
						.setDescription(`> You can't send more than 4 emoji in a message`);
					return interaction.reply({ embeds: [embed] });
				}
			}

			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> ${args.length} emojis will be sent, please wait!`)
				.setColor(client.embed.color.green);
			interaction.reply({ embeds: [embed] });

			for (const rawEmoji of args) {
				const parsedEmoji = Util.parseEmoji(rawEmoji);
				if (parsedEmoji.id) {
					const extension = parsedEmoji.animated ? '.gif' : '.png';
					const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
					return await interaction.channel.send({ content: `> Emoji URL:\n${url}` });
				}
			}
		} catch (error) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(`> Please enter a valid custom emoji.`);
			return interaction.reply({ embeds: [embed] });
		}
	},
};
