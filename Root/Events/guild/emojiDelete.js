module.exports = {
	name: 'emojiDelete',
	run: async (emoji, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = emoji.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const embed = new container.Discord.MessageEmbed()
							.setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL({ dynamic: true }) })
							.setTitle('🥳 Emoji Deleted')
							.setDescription(`**Emoji deleted!**`)
							.setThumbnail(emoji.url)
							.setColor(client.embed.color.onix)
							.setTimestamp();

						const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
						if (!ChannelFetch) return;
						if (ChannelFetch) {
							await ChannelFetch.fetchWebhooks().then((webhooks) => {
								const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
								if (!webhook) return;
								if (webhook) {
									return webhook.send({ embeds: [embed] });
								}
							});
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
