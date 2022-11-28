const { connection } = require('mongoose');
const moment = require('moment');
require('moment-duration-format');
module.exports = {
	name: 'ping',
	description: 'Run this to see my ping.',
	usage: ['ping'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		let embed1 = new container.Discord.MessageEmbed().setDescription('Ping...');
		let msg = await interaction.reply({
			embeds: [embed1],
			fetchReply: true,
		});

		let ws = client.ws.ping;
		var msgEdit = msg.createdTimestamp - interaction.createdTimestamp;
		let Database = connection.readyState;
		const info = new container.Discord.MessageEmbed()
			.setAuthor({
				name: '🏓 | Pong!',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.addField(
				'<:note:963914219852558386> Ping List',
				`Bot : ${msgEdit - 400}ms\nDiscord API : ${ws}ms\nDatabase : ${Database}ms`,
				true,
			)
			.addField(
				'<:note:963914219852558386> Bot Uptime',
				`Started At : ${moment(client.readyTimestamp).format('YYYY/MM/DD - HH:mm:ss')}\nUptime At : ${moment
					.duration(client.uptime)
					.format('y [Years] M [Months] w [Weeks] d [Days] h [Hours] m [Minutes] s [Seconds]')}`,
				false,
			)
			.setColor(client.embed.color.onix)
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setFooter({
				text: client.embed.text.setFooter + interaction.user.username,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp();
		return interaction.editReply({ embeds: [info] });
	},
};
