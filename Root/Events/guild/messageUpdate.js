module.exports = {
	name: 'messageUpdate',
	run: async (oldMessage, newMessage, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = newMessage.guild;
		if (!oldMessage.content) return;
		if (!newMessage.content) return;
		if (oldMessage.content.length === null || newMessage.content.length === null) return;
		if (newMessage === null) return;
		if (oldMessage === null) return;
		if (oldMessage.author.bot) return;
		if (newMessage.author.bot) return;
		if (oldMessage.channel.type === 'DM' || !oldMessage.guild) return;
		if (newMessage.channel.type === 'DM' || !newMessage.guild) return;
		if (oldMessage.content === newMessage.content) return;

		if (oldMessage.content && newMessage.content) {
			if (oldMessage.content.length && newMessage.content.length) {
				if (oldMessage.content != newMessage.content) {
					LogsSchema.findOne(
						{
							guildID: guild.id,
						},
						async (err, DataSchema) => {
							if (DataSchema) {
								if (DataSchema.toggleStatus === true) {
									if (oldMessage.content !== newMessage.content) {
										if (newMessage.content.length > 1024)
											newMessage.content = newMessage.content.slice(0, 1021) + '...';
										if (oldMessage.content.length > 1024)
											oldMessage.content = oldMessage.content.slice(0, 1021) + '...';
										const embed = new container.Discord.MessageEmbed()
											.setAuthor({
												name: newMessage.author.tag,
												iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
											})
											.setDescription(
												`📝 **Message sent by ${newMessage.author} edited in ${newMessage.channel}.**\n[Jump To Message](${newMessage.url}})`,
											)
											.addFields(
												{
													name: 'Old:',
													value: `\`\`\`\n${oldMessage.content}\`\`\``,
												},
												{
													name: 'New:',
													value: `\`\`\`\n${newMessage.content}\`\`\``,
												},
											)
											.setColor(client.embed.color.onix)
											.setFooter({
												text: newMessage.author.tag,
												iconURL: newMessage.author.displayAvatarURL({ dynamic: true }),
											})
											.setTimestamp();
										const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
										if (ChannelFetch) {
											const SendWebhook = new container.Discord.WebhookClient({ url: DataSchema.WebhookURL });
											return SendWebhook.send({ embeds: [embed] });
										}
									}
								} else {
									return;
								}
							}
						},
					);
				}
			}
		}
	},
};
