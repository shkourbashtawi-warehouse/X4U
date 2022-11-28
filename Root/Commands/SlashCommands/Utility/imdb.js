const fetch = require('node-fetch');
module.exports = {
	name: 'imdb',
	description: 'Search for a movie or tv-show on IMDB',
	usage: ['imdb [name-movive/tv-show]'],
	category: 'Utility',
	cooldown: 10,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'imdb-search',
			description: 'The name video to search.',
			type: 3,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		const imdbsearch = interaction.options.getString('imdb-search');
		if (!imdbsearch) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please provide a valid name to search`)
				.setColor(client.embed.color.red);
			interaction.reply({ embeds: [embed] });
		}

		let result;
		try {
			const result = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(imdbsearch)}`).then((res) =>
				res.json(),
			);
		} catch (error) {
			if (error.name === 'FetchError') {
				const embed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription('Something went wrong while fetching the data from the API try again later.');
				return interaction.reply({ embeds: [embed] });
			}
		}

		const result2 = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(imdbsearch)}`).then((res) =>
			res.json(),
		);

		const embed1 = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.onix)
			.setThumbnail(result2.poster)
			.setURL(result2.imdburl)
			.setTitle(result2.title)
			.addField('Ratings', `${result2.ratings[0].value || 'None'}`, true)
			.addField('Votes', `${result2.votes || 'None'}`, true)
			.addField('Country', `${result2.country || 'None'}`, true)
			.addField('Languages', `${result2.languages || 'None'}`, true)
			.addField('Box Office', `${result2.boxoffice || 'None'}`, true)
			.addField('Director', `${result2.director || 'None'}`, true)
			.addField('Run Time', `${result2.runtime || 'None'}`, true)
			.addField('Type', `${result2.type || 'None'}`, true)
			.addField('Released', `<t:${new Date(result2.released).getTime() / 1000}:d>`, true)
			.setDescription(result2.plot.slice(0, 4093) + '..')
			.setFooter({
				text: `Score : IMDB : ${result2.ratings[0].value} | ${result2.ratings[1].source} : ${result2.ratings[1].value}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp();
		interaction.reply({ embeds: [embed1] });
	},
};
