module.exports = {
	name: 'choose',
	description: 'Create a choose in your server with some options',
	usage: ['choose [options]'],
	category: 'Fun',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'options',
			description: 'A comma (,) separated list of up to 5 options. ex : option1,option2,option3,',
			type: 3,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		const options = interaction.options.getString('options');

		let opt = options.split(/,\s*/);
		if (opt.length < 2) {
			let embed = new container.Discord.MessageEmbed()
				.setDescription(`> You must enter a minimum of 2 choose options`)
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed] });
		}
		if (opt.length > 5) {
			let embed1 = new container.Discord.MessageEmbed()
				.setDescription(`> You must only enter a maximum of 5 choose options`)
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed1] });
		}

		let random = await opt[Math.floor(Math.random() * opt.length)];
		let embed2 = new container.Discord.MessageEmbed()
			.setDescription(`> I'm choosing : **__${random}__**`)
			.setColor(client.embed.color.onix);
		return await interaction.reply({ embeds: [embed2] });
	},
};
