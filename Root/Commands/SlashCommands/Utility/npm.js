const fetch = require('node-fetch');
module.exports = {
	name: 'npm',
	description: 'Search for a package on npm.',
	usage: ['npm [package]'],
	category: 'Utility',
	cooldown: 10,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'package',
			description: 'Please provide a name to search.',
			type: 3,
			required: true,
			autocomplete: true,
		},
	],
	run: async (client, interaction, container) => {
		const npm = interaction.options.getString('package');
		if (!npm) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please provide a valid name to search`)
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed] });
		}

		function ellipsis(text, total) {
			if (text.length <= total) {
				return text;
			}
			const keep = total - 3;
			if (keep < 1) {
				return text.slice(0, total);
			}
			return `${text.slice(0, keep)}...`;
		}

		let response;
		response = await fetch('https://api.npms.io/v2/search?q=' + npm).then((res) => res.json());
		const pkg = response.results[0].package;
		const embed1 = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'NPM Search',
				iconURL: 'https://i.imgur.com/ErKf5Y0.png',
				url: 'https://www.npmjs.com/',
			})
			.setTitle(`${pkg.name || 'No name'}`)
			.setDescription(`${pkg.description || 'No description'}`)
			.addFields(
				{
					name: 'Author :',
					value: pkg.author ? pkg.author.name : 'None',
				},
				{
					name: 'Version :',
					value: pkg.version,
				},
				{
					name: 'Description :',
					value: ellipsis(pkg.description, 1024) || 'None',
				},
				{
					name: 'Repository :',
					value: pkg.links.repository ? pkg.links.repository : 'None',
				},
				{
					name: 'Maintainers :',
					value: ellipsis(pkg.maintainers ? pkg.maintainers.map((e) => e.username).join(', ') : 'None', 1024),
				},
				{
					name: 'Keywords :',
					value: ellipsis(pkg.keywords ? pkg.keywords.join(', ') : 'None', 1024),
				},
			)
			.setThumbnail(
				`https://images-ext-1.discordapp.net/external/JsiJqfRfsvrh5IsOkIF_WmOd0_qSnf8lY9Wu9mRUJYI/https/images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png`,
			)
			.setColor(client.embed.color.onix)
			.setFooter({
				text: `Name Package : ${pkg.name || 'No name'} | Source : npmjs`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp();
		await interaction.reply({
			embeds: [embed1],
		});
	},
};
