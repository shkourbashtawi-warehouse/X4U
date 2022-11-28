module.exports = {
	name: 'messageDelete',
	run: async (message, client, container) => {
		const MaintenanceScehma = require('../../Database/Other/Maintenance');
		const Snipe = require('../../Database/Other/Snipe');
		const LogsSchema = require('../../Database/Other/Logs');
		const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
		if (Maintenance) {
			if (Maintenance.toggleStatus === true) {
				return;
			}
		}

		const guild = message.guild;
		if (message.channel.type === 'DM' || !guild) return;

		let snipe = await Snipe.findOne({ guildId: guild.id, channelID: message.channel.id });
		if (message && message.author && !message.author.bot) {
			if (!snipe) {
				const snipeSave = new Snipe({
					guildId: guild.id,
					channelID: message.channel.id,
				});
				snipeSave.message.push(message.content || null);
				snipeSave.tag.push(message.author.id);
				snipeSave.image.push(message.attachments.first() ? message.attachments.first().proxyURL : null);
				snipeSave.save().catch(() => {});
				snipe = await Snipe.findOne({ guildId: guild.id, channelID: message.channel.id });
			} else {
				if (snipe.message.length > 4) {
					snipe.message.splice(-5, 1);
					snipe.tag.splice(-5, 1);
					snipe.image.splice(-5, 1);
					snipe.message.push(message.content || null);
					snipe.tag.push(message.author.id);
					snipe.image.push(message.attachments.first() ? message.attachments.first().proxyURL : null);
				} else {
					snipe.message.push(message.content || null);
					snipe.tag.push(message.author.id);
					snipe.image.push(message.attachments.first() ? message.attachments.first().proxyURL : null);
				}
				snipe.save().catch(() => {});
			}
		}
		if (message.webhookID || (!message.content && message.embeds.length === 0)) return;
		LogsSchema.findOne(
			{
				guildID: guild.id,
			},
			async (err, DataSchema) => {
				if (DataSchema) {
					if (DataSchema.toggleStatus === true) {
						if (message.author.bot) return;
						const Photo = message.attachments.map((x) => x.proxyURL) || 'No Attachment Detected';
						if (message.content.length > 1024) message.content = message.content.slice(0, 1021) + '...';
						const embed = new container.Discord.MessageEmbed()
							.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
							.setDescription(
								`
								**Author : ** <@${message.author.id}> - *${message.author.tag}*
**Channel : ** <#${message.channel.id}> - *${message.channel.name}*
**Deleted Message : **
\`\`\`
${message.content.replace(/`/g, "'")}
\`\`\`
**Attachment URL : *${Photo}*
`,
							)
							.setColor(client.embed.color.onix)
							.setTimestamp();

						const ChannelFetch = await guild.channels.cache.get(DataSchema.EveryLogsChannel);
						if (!ChannelFetch) return;
						if (ChannelFetch) {
							await ChannelFetch.fetchWebhooks()
								.then((webhooks) => {
									const webhook = webhooks.find((webhook) => webhook.owner.id === client.user.id);
									if (!webhook) return;
									if (webhook) {
										return webhook.send({ embeds: [embed] });
									}
								})
								.catch(() => {});
						}
					} else {
						return;
					}
				}
			},
		);
	},
};
