module.exports = {
	name: 'embed1',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		const row = new container.Discord.MessageActionRow()
			.addComponents(
				new container.Discord.MessageButton()
					.setLabel('Jockie Commands')
					.setStyle('LINK')
					.setURL('https://www.jockiemusic.com/commands'),
			)
			.addComponents(
				new container.Discord.MessageButton()
					.setLabel('Hydra Commands')
					.setStyle('LINK')
					.setURL('https://hydra.bot/commands'),
			);

		const embed = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.noembed)
			.setImage('https://i.imgur.com/O3npPuq.png');
		message.channel.send({
			embeds: [embed],
			components: [row],
		});

		message.channel.send({
			content:
				'```fix\nDelete Any Message After 5 Minutes Automatically\n```\n> **Pls Write Here Command ( <@411916947773587456> & <@412347257233604609> & <@412347553141751808> & <@547905866255433758> ) `Only` **\n\n```diff\n- PLS NOT SPAMING , RESPECT MY EARS  , NOT RUN BAD MUSIC ! -\n```',
		});
	},
};
