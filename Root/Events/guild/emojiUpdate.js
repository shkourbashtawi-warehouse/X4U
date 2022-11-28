module.exports = {
	name: 'emojiUpdate',
	run: async (oldEmoji, newEmoji, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = oldEmoji.guild;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						const fetchEmojiAuthor = await newEmoji.fetchAuthor();
						if (oldEmoji.name !== newEmoji.name) {
							const embed = new container.Discord.MessageEmbed()
								.setAuthor({ name: newEmoji.guild.name, iconURL: newEmoji.guild.iconURL({ dynamic: true }) })
								.setTitle('🤩 Emoji Updated')
								.setDescription(`**${fetchEmojiAuthor} has updated <:${newEmoji.name}:${newEmoji.id}> emoji**`)
								.addFields(
									{
										name: 'Old name:',
										value: oldEmoji.name,
									},
									{
										name: 'New name:',
										value: newEmoji.name,
									},
									{
										name: 'ID',
										value: `\`\`\`ini\nEmojiID = ${newEmoji.id}\nPerpetrator = ${fetchEmojiAuthor.id}\`\`\``,
									},
								)
								.setColor(client.embed.color.onix)

								.setFooter({
									text: fetchEmojiAuthor.tag,
									iconURL: fetchEmojiAuthor.displayAvatarURL({ dynamic: true }),
								})
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
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
