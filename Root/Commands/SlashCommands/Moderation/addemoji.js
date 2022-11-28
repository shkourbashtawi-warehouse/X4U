module.exports = {
	name: 'addemoji',
	description: 'Add emoji to your server',
	usage: ['addemoji [emoji] <emoji_name>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_EMOJIS_AND_STICKERS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'emoji',
			description: 'Emoji you want to add to the server',
			type: 3,
			required: true,
		},
		{
			name: 'emoji_name',
			description: 'Name of emoji',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		const emoji = interaction.options.getString('emoji');
		const emojiName = interaction.options.getString('emoji_name');

		if (emojiName) {
			const EmojiNamleLower = emojiName.toLowerCase();
			const emojiNameRegex = /^[a-zA-Z0-9_]+$/;
			if (!emojiNameRegex.test(EmojiNamleLower)) {
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> Emoji name can only contain letters, numbers and underscores`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed],
				});
			}
		}

		if (emoji.length > 32) {
			let embed = new container.Discord.MessageEmbed()
				.setDescription(`> Emoji name can only be 32 characters long`)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed],
			});
		}

		const parseCustomEmoji = container.Discord.Util.parseEmoji(emoji);
		if (parseCustomEmoji.id) {
			const emojiLink = `https://cdn.discordapp.com/emojis/${parseCustomEmoji.id}.${
				parseCustomEmoji.animated ? 'gif' : 'png'
			}`;
			if (emojiName) {
				const AAA = emojiName.toLowerCase();
				const createEmoji = await interaction.guild.emojis.create(emojiLink, AAA);
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> Added <:${createEmoji.name}:${createEmoji.id}> emoji`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed],
				});
			} else if (!emojiName) {
				const AAA = parseCustomEmoji.name;
				const createEmoji = await interaction.guild.emojis.create(emojiLink, AAA);
				let embed = new container.Discord.MessageEmbed()
					.setDescription(`> Added <:${createEmoji.name}:${createEmoji.id}> emoji`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed],
				});
			}
		} else {
			let embed1 = new container.Discord.MessageEmbed()
				.setDescription(`> Not vaild emoji`)
				.setColor(client.embed.color.red);
			interaction.reply({
				embeds: [embed1],
			});
		}
	},
};
