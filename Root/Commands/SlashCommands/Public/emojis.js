module.exports = {
	name: 'emojis',
	description: 'Show guild emojis.',
	usage: ['emojis'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		let Emojis = '';
		let EmojisAnimated = '';
		let EmojiCount = 0;
		let Animated = 0;
		let OverallEmojis = 0;
		function Emoji(id) {
			return client.emojis.cache.get(id).toString();
		}
		interaction.guild.emojis.cache.forEach((emoji) => {
			OverallEmojis++;
			if (emoji.animated) {
				Animated++;
				EmojisAnimated += Emoji(emoji.id);
			} else {
				EmojiCount++;
				Emojis += Emoji(emoji.id);
			}
		});

		let Stringg = `**Animated [${Animated}]**:\n${EmojisAnimated}\n\n**Standard [${EmojiCount}]**:\n${Emojis}`;
		if (Stringg.length > 1996) {
			Stringg = Stringg.slice(0, 1996) + '...';
			let Embed1 = new container.Discord.MessageEmbed()
				.setTitle(`${EmojiCount} Standard, ${Animated} Animated, (${OverallEmojis} Total)`)
				.setDescription(Stringg)
				.setColor(client.embed.color.onix);
			return interaction.reply({ embeds: [Embed1] });
		}
		let Embed1 = new container.Discord.MessageEmbed()
			.setTitle(`${EmojiCount} Standard, ${Animated} Animated, (${OverallEmojis} Total)`)
			.setDescription(Stringg)
			.setColor(client.embed.color.onix);
		interaction.reply({ embeds: [Embed1] });
	},
};
