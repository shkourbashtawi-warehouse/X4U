module.exports = {
	name: 'clear',
	description: 'Delete up to 100 messages from the channel',
	usage: ['clear [amount]'],
	category: 'Moderation',
	cooldown: 5,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_MESSAGES', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'amount',
			description: 'Amount of messages you want to delete.',
			type: 10,
			maxValue: 100,
			minValue: 1,
		},
		{
			name: 'user',
			description: 'The user you want to delete messages from.',
			type: 6,
		},
		{
			name: 'role',
			description: 'The role you want to delete messages from.',
			type: 8,
		},
	],
	run: async (client, interaction, container) => {
		await interaction.deferReply({ ephemeral: false }).catch((e) => { });
		try {
			const amount = interaction.options.getNumber('amount') || 99;
			const member = interaction.options.getMember('user');
			const role = interaction.options.getRole('role');

			if (member) {
				const messages = await interaction.channel.messages.fetch({ limit: amount });
				if (messages.size === 0) {
					const embed = new container.Discord.MessageEmbed()
						.setDescription(`> There are no messages to delete.`)
						.setColor(client.embed.color.red);
					return interaction.followUp({ embeds: [embed] });
				}
				const filtered = await messages.filter((messages) => messages.author.id === member.id);
				if (filtered.size === 0) {
					const embed1 = new container.Discord.MessageEmbed()
						.setDescription(`> No messages to delete from ${member.user.tag}`)
						.setColor(client.embed.color.red);
					return interaction.followUp({ embeds: [embed1] });
				}
				await interaction.deleteReply();
				await interaction.channel.bulkDelete(filtered);
				const embed3 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.onix)
					.setTitle(`${filtered.size} messages have been deleted from ${member.user.username} messages`)
					.setDescription(`${member.user.tag}: ${filtered.size}`)
					.setFooter({
						text: `The message will be deleted after 2 seconds`,
						iconURL: interaction.guild.iconURL({ dynamic: true }),
					});
				await interaction.channel.send({ embeds: [embed3] }).then(async (msg) => {
					setTimeout(() => {
						msg.delete().catch(() => { return });
					}, 3 * 1000);
				});
				return;
			}

			if (role) {
				const messages = await interaction.channel.messages.fetch({ limit: amount });
				if (messages.size === 0) {
					const embed = new container.Discord.MessageEmbed()
						.setDescription(`> There are no messages to delete.`)
						.setColor(client.embed.color.red);
					return interaction.followUp({ embeds: [embed] });
				}
				const filtered = await messages.filter((messages) => messages.member.roles.cache.has(role.id));
				if (filtered.size === 0) {
					const embed1 = new container.Discord.MessageEmbed()
						.setDescription(`> No messages to delete from ${role.name}`)
						.setColor(client.embed.color.red);
					return interaction.followUp({ embeds: [embed1] });
				}
				await interaction.deleteReply();
				await interaction.channel.bulkDelete(filtered).then(async (Messages) => {
					const results = {};
					for (const [, deleted] of Messages) {
						if (!deleted.author) return;
						const user = `${deleted.author.username}#${deleted.author.discriminator}`;
						if (!results[user]) results[user] = 0;
						results[user]++;
					}
					const userMessageMap = Object.entries(results);
					const finalResult = `${filtered.size} messages have been deleted from the ${role.name} messages`;
					const deleteCount = `${userMessageMap.map(([user, messages]) => `**${user}**: ${messages}`).join('\n')}`;
					const embed4 = new container.Discord.MessageEmbed()
						.setColor(client.embed.color.onix)
						.setTitle(finalResult)
						.setDescription(deleteCount)
						.setFooter({
							text: `The message will be deleted after 2 seconds`,
							iconURL: interaction.guild.iconURL({ dynamic: true }),
						});
					await interaction.channel.send({ embeds: [embed4] }).then(async (msg) => {
						setTimeout(() => {
							msg.delete().catch(() => { return });
						}, 3 * 1000);
					});
				});
				return;
			}

			if (!member && !role) {
				await interaction.deleteReply();
				const fetch = await interaction.channel.messages.fetch({ limit: amount });
				await interaction.channel.bulkDelete(fetch, true).then(async (Messages) => {
					const results = {};
					for (const [, deleted] of Messages) {
						if (!deleted.author) return;
						const user = `${deleted.author.username}#${deleted.author.discriminator}`;
						if (!results[user]) results[user] = 0;
						results[user]++;
					}
					const userMessageMap = Object.entries(results);
					const finalResult = `${Messages.size} message${Messages.size > 1 ? 's' : ''} were removed!`;
					const deleteCount = `${userMessageMap.map(([user, messages]) => `**${user}**: ${messages}`).join('\n')}`;
					const embed4 = new container.Discord.MessageEmbed()
						.setColor(client.embed.color.onix)
						.setTitle(finalResult)
						.setDescription(deleteCount)
						.setFooter({
							text: `The message will be deleted after 2 seconds`,
							iconURL: interaction.guild.iconURL({ dynamic: true }),
						});
					await interaction.channel.send({ embeds: [embed4] }).then(async (msg) => {
						setTimeout(() => {
							msg.delete().catch(() => { return });
						}, 3 * 1000);
					});
				});
			}
		} catch (error) {
			const embed5 = new container.Discord.MessageEmbed()
				.setDescription(`> There are no messages to delete or messages are over 14 days old.`)
				.setColor(client.embed.color.red);
			return interaction.followUp({ embeds: [embed5] });
		}
	},
};
