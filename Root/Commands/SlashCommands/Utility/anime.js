const malScraper = require('mal-scraper');
module.exports = {
	name: 'anime',
	description: 'To get some information about a specific anime',
	usage: ['anime [name]'],
	category: 'Utility',
	cooldown: 10,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'name',
			description: 'Write the name of the anime you want to get information about',
			type: 3,
			required: true,
			autocomplete: true,
		},
	],
	run: async (client, interaction, container) => {
		const query = interaction.options.getString('name');
		if (!query) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please provide a valid name to search`)
				.setColor(client.embed.color.red);
			interaction.reply({ embeds: [embed] });
		}

		if (
			query.includes('hentai') ||
			query.includes('porn') ||
			query.includes('ass') ||
			query.includes('fuck') ||
			query.includes('sex')
		) {
			let embed = new container.Discord.MessageEmbed()
				.setDescription(`> This command can only be used in Age-Restricted(NSFW) channels!`)
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed] });
		}

		let embed1 = new container.Discord.MessageEmbed()
			.setDescription(`> Searching for ${query}...!`)
			.setColor(client.embed.color.orange);
		await interaction.reply({ embeds: [embed1], fetchReply: true });

		const data = await malScraper.getInfoFromName(query);
		let Genres = `${data.genres.join(', ')}` || 'None';
		let Studios = `${data.studios.join(', ')}` || 'None';
		let embed2 = new container.Discord.MessageEmbed()
			.setURL(data.url)
			.setTitle(data.title)
			.setDescription(data.synopsis)
			.setThumbnail(data.picture)
			.addField(`Type`, data.type, true)
			.addField(`Episodes`, data.episodes, true)
			.addField(`Status`, data.status, true)
			.addField(`Score`, data.score, true)
			.addField(`Aired`, data.aired, true)
			.addField(`Genres`, `${Genres}`, true)
			.addField(`Studios`, `${Studios}`, true)
			.addField(`Source`, data.source, true)
			.addField(`Duration`, data.duration, true)
			.addField(`Rating`, data.rating, true)
			.setFooter({
				text: `Score : ${data.score} | Source : MyAnimeList`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp()
			.setColor(client.embed.color.onix);
		return interaction.editReply({ embeds: [embed2] });
	},
};
