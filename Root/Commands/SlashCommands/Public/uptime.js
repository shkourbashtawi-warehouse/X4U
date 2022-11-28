const { connection } = require('mongoose');
const moment = require('moment');
require('moment-duration-format');
module.exports = {
	name: 'uptime',
	description: 'See bot from when it is alive!',
	usage: ['uptime'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	run: async (client, interaction, container) => {
		function switchTo(val) {
			var status = ' ';
			switch (val) {
				case 0:
					status = `🔴 Disconnected!`;
					break;
				case 1:
					status = `🟢 Connceted!`;
					break;
				case 2:
					status = `🟠 Connecting!`;
					break;
				case 3:
					status = `🔴 Disconnecting!`;
					break;
			}
			return status;
		}

		const Response = new container.Discord.MessageEmbed()
			.setAuthor({
				name: 'X4U Bot Uptime',
				iconURL: client.user.displayAvatarURL({ dynamic: true }),
			})
			.addField(
				'<:note:963914219852558386> Uptime Bot',
				`Started At : \`\`\`${moment(client.readyTimestamp).format(
					'YYYY/MM/DD - HH:mm:ss',
				)}\`\`\`\nUptime At : \`\`\`${moment
					.duration(client.uptime)
					.format('y [Years] M [Months] w [Weeks] d [Days] h [Hours] m [Minutes] s [Seconds]')}\`\`\``,
				false,
			)

			.addField('<:note:963914219852558386> Uptime Website', `\`\`\`Soon will be added!!\`\`\``, false)
			.setColor(client.embed.color.onix)
			.setFooter({
				text: client.embed.text.setFooter + interaction.user.username,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp();
		interaction.reply({ embeds: [Response] });
	},
};
