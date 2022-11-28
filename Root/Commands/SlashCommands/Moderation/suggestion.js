const SugestionSchema = require('../../../Database/Other/Sugestion');
module.exports = {
	name: 'suggestion',
	description: 'To accept or decline a suggestion in the suggestion channel',
	usage: ['suggestion accept/decline [id] <reason>'],
	category: 'Moderation',
	cooldown: 30,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'accept',
			description: 'Accept a suggestion',
			type: 1,
			options: [
				{
					name: 'id',
					description: 'The suggestion to accept (ID Message).',
					type: 3,
					required: true,
				},
				{
					name: 'reason',
					description: 'The reason why the suggestion should be accepted.',
					type: 3,
					required: true,
				},
			],
		},
		{
			name: 'decline',
			description: 'Deny the worst suggestions',
			type: 1,
			options: [
				{
					name: 'id',
					type: 3,
					description: 'The suggestion to deny (ID Message).',
					required: true,
				},
				{
					name: 'reason',
					type: 3,
					description: 'The reason why the suggestion should be deny.',
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		const messageID = interaction.options.getString('id');
		const replyQuery = interaction.options.getString('reason') || 'No provided reason.';
		if (replyQuery.length > 1990) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please input text less 1990 Letters`)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed],
			});
		}
		if (interaction.options.getSubcommand() === 'accept') {
			SugestionSchema.findOne({
				guildID: interaction.guildId,
			})
				.then(async (doc) => {
					if (!doc) {
						const embed1 = new container.Discord.MessageEmbed()
							.setColor(client.embed.color.red)
							.setDescription(`> No suggestion system in server please user \`/settings suggestion-channel\` again`);
						return interaction.reply({
							embeds: [embed1],
							ephemeral: true,
						});
					} else {
						const suggestionChannel = await interaction.guild.channels.cache.get(doc.channelID);
						const suggestedEmbed = await suggestionChannel.messages.fetch(messageID).catch((error) => {
							const noMessage = new container.Discord.MessageEmbed()
								.setDescription(
									`> I can't find any message with that ID Message in ${suggestionChannel}.\nplease use a valid message ID.`,
								)
								.setColor(client.embed.color.red);
							return interaction.reply({ embeds: [noMessage], ephemeral: true });
						});

						const dataa = suggestedEmbed.embeds[0];
						const embed2 = new container.Discord.MessageEmbed()
							.setDescription(`> Done Accepct`)
							.setColor(client.embed.color.green);
						interaction.reply({ embeds: [embed2], ephemeral: true });

						const replyEmbed = new container.Discord.MessageEmbed()
							.setAuthor({
								name: dataa.author.name,
								iconURL: dataa.author.iconURL,
							})
							.addFields(
								{
									name: '**__Suggestion__**',
									value: `${dataa.fields[0].value}`,
								},
								{
									name: `**__Status__**`,
									value: `✅ Accepted by __${interaction.user.username}__ :\n${replyQuery}`,
								},
							)
							.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
							.setColor(client.embed.color.green)
							.setFooter({
								text: `ID: (${messageID}) - Want to suggest? write in this channel`,
							})
							.setTimestamp();
						suggestedEmbed.edit({ embeds: [replyEmbed] });
						suggestedEmbed.reactions.removeAll();

						const user = await client.users.cache.find((u) => u.username === dataa.author.name);

						const embed3 = new container.Discord.MessageEmbed()
							.setAuthor({
								name: interaction.guild.name,
								iconURL: interaction.guild.iconURL({ dynamic: true }),
							})
							.setDescription(
								`Hi ${dataa.author.name}\n\n Your suggestion has already been accepted by : ${interaction.user}\n\nReply message to your suggestion :\n${replyQuery}.`,
							)
							.setColor(client.embed.color.green)
							.setFooter({
								text: `Thank You for Suggestion ${dataa.author.name}`,
								iconURL: dataa.author.iconURL,
							});

						const Link = new container.Discord.MessageActionRow().addComponents(
							new container.Discord.MessageButton()
								.setURL(`https://discord.com/channels/${interaction.guild.id}/${doc.channelID}/${messageID}`)
								.setLabel('Your suggestion')
								.setStyle('LINK')
								.setEmoji('🔗'),
						);
						try {
							await user.send({ embeds: [embed3], components: [Link] });
						} catch (e) {
							console.log(e);
						}
					}
				})
				.catch(() => {});
		}

		if (interaction.options.getSubcommand() === 'decline') {
			SugestionSchema.findOne({
				guildID: interaction.guildId,
			})
				.then(async (doc) => {
					if (!doc) {
						const embed4 = new container.Discord.MessageEmbed()
							.setColor(client.embed.color.red)
							.setDescription(`> No suggestion system in server please user \`/settings suggestion-channel\` again`);
						return interaction.reply({
							embeds: [embed4],
							ephemeral: true,
						});
					} else {
						const suggestionChannel = await interaction.guild.channels.cache.get(doc.channelID);
						const suggestedEmbed = await suggestionChannel.messages.fetch(messageID).catch((error) => {
							const noMessage = new container.Discord.MessageEmbed()
								.setDescription(
									`> I can't find any message with that ID Message in ${suggestionChannel}.\nplease use a valid message ID.`,
								)
								.setColor(client.embed.color.red);
							return interaction.reply({ embeds: [noMessage], ephemeral: true });
						});

						const dataa = suggestedEmbed.embeds[0];

						const embed66 = new container.Discord.MessageEmbed()
							.setDescription(`> Done Declined`)
							.setColor(client.embed.color.green);
						interaction.reply({ embeds: [embed66], ephemeral: true });

						const replyEmbed = new container.Discord.MessageEmbed()
							.setAuthor({
								name: dataa.author.name,
								iconURL: dataa.author.iconURL,
							})
							.addFields(
								{
									name: '**__Suggestion__**',
									value: `${dataa.fields[0].value}`,
								},
								{
									name: `**__Status__**`,
									value: `❌ Declined by __${interaction.user.username}__ :\n${replyQuery}`,
								},
							)
							.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
							.setColor(client.embed.color.red)
							.setFooter({
								text: `ID: (${messageID}) - Want to suggest? write in this channel`,
							})
							.setTimestamp();
						suggestedEmbed.edit({ embeds: [replyEmbed] });
						suggestedEmbed.reactions.removeAll();

						const user = await client.users.cache.find((u) => u.username === dataa.author.name);

						const embed5 = new container.Discord.MessageEmbed()
							.setAuthor({
								name: interaction.guild.name,
								iconURL: interaction.guild.iconURL({ dynamic: true }),
							})
							.setDescription(
								`Hi ${dataa.author.name}\n\nYour suggestion has been rejected by : ${interaction.user}\n\nReply message to your suggestion :\n${replyQuery}.`,
							)
							.setColor(client.embed.color.green)
							.setFooter({
								text: `Thank You for Suggestion ${dataa.author.name}`,
								iconURL: dataa.author.iconURL,
							});

						const Link = new container.Discord.MessageActionRow().addComponents(
							new container.Discord.MessageButton()
								.setURL(`https://discord.com/channels/${interaction.guild.id}/${doc.channelID}/${messageID}`)
								.setLabel('Your suggestion')
								.setStyle('LINK')
								.setEmoji('🔗'),
						);
						try {
							await user.send({ embeds: [embed5], components: [Link] });
						} catch (e) {
							console.log(e);
						}
					}
				})
				.catch(() => {});
		}
	},
};
