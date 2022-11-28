module.exports = {
	name: 'embed2',
	ownerOnly: true,
	returnOwnerOnly: false,
	run: async (client, message, args, container) => {
		const row = new container.Discord.MessageActionRow()
			.addComponents(
				new container.Discord.MessageButton()
					.setLabel('EmpyManager Commands')
					.setStyle('LINK')
					.setURL('https://docs.empymanager.com/commands'),
			)
			.addComponents(
				new container.Discord.MessageButton()
					.setLabel('X4U Voice Commands')
					.setStyle('LINK')
					.setURL('https://imgur.com/7qBd2Wm'),
			);

		const embed = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.noembed)
			.setImage('https://i.imgur.com/fHnZTMQ.png');
		message.channel.send({
			embeds: [embed],
			components: [row],
		});

		message.channel.send({
			content:
				'```fix\nDelete Any Message After 5 Minutes Automatically\n```\n> **Pls Write Here Command ( <@803780837702631454> & <@719236419230367798> ) `Only`\n> **If Bot <@803780837702631454> Dont Response For You Just Write : **`lang ar` **&** `stop`**\n\n```diff\n- PLS NOT SPAMING , RESPECT MY EARS  , NOT RUN BAD MUSIC ! -\n```',
		});
	},
};
