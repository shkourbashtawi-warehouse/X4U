const warnModel = require('../../../Database/Other/Warn');
module.exports = {
	name: 'warn',
	description: 'advanced warning system',
	usage: ['warn add/check/remove [user] [warnid] <reason>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'add',
			description: 'add a warning to user',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'user',
					description: 'user to add warn',
					type: 6,
					required: true,
				},
				{
					name: 'reason',
					description: 'reason to add',
					type: 3,
				},
			],
		},
		{
			name: 'check',
			description: 'check your warnings or other',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'user',
					description: 'user to see warnings.',
					type: 6,
					required: true,
				},
			],
		},
		{
			name: 'remove',
			description: 'warn to remove',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'warnid',
					description: 'warn id you want to remove',
					type: 3,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'add') {
			const member = interaction.options.getMember('user');
			const reason = interaction.options.getString('reason') || 'No reason';

			if (member.id === interaction.user.id) {
				const embed2 = new container.Discord.MessageEmbed()
					.setDescription(`> You can't warn yourself.`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed2],
					ephemeral: true,
				});
			}

			if (member.id === interaction.guild.ownerId) {
				const embed1 = new container.Discord.MessageEmbed()
					.setDescription(`> You can't warn the owner of the server.`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed1],
					ephemeral: true,
				});
			}

			if (member.id === interaction.guild.me.id) {
				const embed3 = new container.Discord.MessageEmbed()
					.setDescription(`> I can't warn myself.`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed3],
					ephemeral: true,
				});
			}

			const role = member.roles.highest.position;
			const authorRole = interaction.member.roles.highest.position;

			if (role >= authorRole) {
				let embed = new container.Discord.MessageEmbed()
					.setDescription("> You can't warn a member who has the same role as you or a higher role than you.")
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			await new warnModel({
				userId: member.id,
				guildId: interaction.guildId,
				moderatorId: interaction.member.id,
				reason,
				timestamp: Date.now(),
			}).save();

			const Scean = await warnModel.find({
				userId: member.id,
				guildId: interaction.guildId,
			});
			const userWarningsCount = Scean.length;
			const Member = await interaction.guild.members.fetch(member.id);
			const Moderator = await interaction.guild.members.fetch(interaction.user.id);
			const ReasonEmebdFiled = `\`\`\`${reason}\`\`\``;

			const embed2 = new container.Discord.MessageEmbed()
				.setTitle('✅ Warned User')
				.addFields([
					{
						name: 'User',
						value: `**__Username:__** ${Member} | **__ID:__** ${Member.id}`,
					},
					{
						name: 'Moderator',
						value: `**__Username:__** ${Moderator} | **__ID:__** ${Moderator.id}`,
					},
					{
						name: 'Reason',
						value: ReasonEmebdFiled,
					},
					{
						name: 'Warnings',
						value: `${userWarningsCount}`,
					},
				])
				.setColor(client.embed.color.green)
				.setTimestamp();
			await interaction.reply({ embeds: [embed2] });
			try {
				const embedDM0 = new container.Discord.MessageEmbed()
					.setDescription(
						`> You have been warned in ${interaction.guild.name} for ${reason}\n\nYou have ${userWarningsCount} warnings.`,
					)
					.setColor(client.embed.color.onix);
				await member.send({
					embeds: [embedDM0],
				});
			} catch (error) {
				console.log('DM CLOSED ;/');
			}
		}

		if (interaction.options.getSubcommand() === 'check') {
			const user = interaction.options.getUser('user') || interaction.user;
			const userWarnings = await warnModel.find({
				userId: user.id,
				guildId: interaction.guildId,
			});

			const Scean = await warnModel.find({
				userId: user.id,
				guildId: interaction.guildId,
			});
			const userWarningsCount = Scean.length;

			const embedDescription = userWarnings
				.map((warn) => {
					const moderator = interaction.guild.members.cache.get(warn.moderatorId);

					return [
						`warnId: ${warn._id}`,
						`Moderator: ${moderator || 'Has Left'}`,
						`Date: <t:${Math.floor(warn.timestamp / 1000)}:R>`,
						`Reason: ${warn.reason}`,
					].join('\n');
				})
				.join('\n\n');
			if (!userWarnings?.length) {
				const embed5 = new container.Discord.MessageEmbed()
					.setTitle(`${user.tag}'s warnings`)
					.setDescription(`${user.tag} has no warnings in the server`)
					.setColor(client.embed.color.orange);
				return interaction.reply({
					embeds: [embed5],
				});
			}
			const embed2 = new container.Discord.MessageEmbed()
				.setTitle(`${user.tag}'s warnings`)
				.setDescription(embedDescription)
				.setColor(client.embed.color.green)
				.setFooter(`He have ${userWarningsCount} Warnings`);

			const msg = await interaction.reply({
				embeds: [embed2],
				fetchReply: true,
			});
			const collector = msg.channel.createMessageComponentCollector({
				time: 20000,
			});

			collector.on('end', async (ignore, error) => {
				if (error && error !== 'success') {
					const embed4 = new container.Discord.MessageEmbed()
						.setDescription(
							'> Timeout... Please use the command again to refresh id warns (Doing that to refresh the id warns)',
						)
						.setColor(client.embed.color.red);
					interaction.editReply({ embeds: [embed4], components: [] });
				}
				collector.stop('success');
			});
		}
		if (interaction.options.getSubcommand() === 'remove') {
			const warnId = interaction.options.getString('warnid');
			try {
				const data = await warnModel.findById(warnId);
			} catch (error) {
				const error1 = new container.Discord.MessageEmbed()
					.setTitle('Error')
					.setDescription('The warn id you have provided is invalid')
					.addField(`WarnId:`, `${warnId}`)
					.setColor('RED');
				interaction.reply({
					embeds: [error1],
				});
			}

			const data = await warnModel.findById(warnId);
			const user = interaction.guild.members.cache.get(data.userId);

			const Member = await interaction.guild.members.fetch(data.userId);
			const Moderator = await interaction.guild.members.fetch(data.moderatorId);

			await data.delete();

			const Scean = await warnModel.find({
				userId: user.id,
				guildId: interaction.guildId,
			});
			const userWarningsCount = Scean.length;

			const embed2 = new container.Discord.MessageEmbed()
				.setTitle('✅ Removed Warm From User')
				.addFields([
					{
						name: 'User',
						value: `**__Username:__** ${Member} | **__ID:__** ${Member.id}`,
					},
					{
						name: 'Moderator',
						value: `**__Username:__** ${Moderator} | **__ID:__** ${Moderator.id}`,
					},
					{
						name: 'Warnings',
						value: `${userWarningsCount}`,
						inline: true,
					},
				])
				.setColor(client.embed.color.green);
			interaction.reply({ embeds: [embed2] });

			try {
				const embedDM1 = new container.Discord.MessageEmbed()
					.setDescription(
						`> Your 1 warning has been removed in ${interaction.guild.name}\n\nYou have ${userWarningsCount} warnings.`,
					)
					.setColor(client.embed.color.onix);
				await user.send({
					embeds: [embedDM1],
				});
			} catch (error) {
				return;
			}
		}
	},
};
