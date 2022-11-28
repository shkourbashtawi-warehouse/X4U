const ms = require('ms');
const humanizeDuration = require('humanize-duration');
const RoleTime = require('../../../Database/Other/RoleTime');
module.exports = {
	name: 'role',
	description: 'Add/Remove a role to user.',
	usage: ['role add/remove [user] [role] <time> <reason>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'add',
			description: 'Add a role to user',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'user',
					description: 'The user you want to give the rank.',
					type: 6,
					required: true,
				},
				{
					name: 'role',
					description: 'The role you want to give him.',
					type: 8,
					required: true,
				},
				{
					name: 'time',
					description: 'If you want to remove the role after a certain period. example: (1m, 1d, 1mo).',
					type: 3,
				},
				{
					type: 3,
					name: 'reason',
					description: 'The reason to give the role.',
				},
			],
		},
		{
			name: 'remove',
			description: 'remove a role to user',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'user',
					description: 'The user you want to pull the role',
					type: 6,
					required: true,
				},
				{
					name: 'role',
					description: 'The role you want to pull from him.',
					type: 8,
					required: true,
				},
				{
					type: 3,
					name: 'reason',
					description: 'The reason to remove the role.',
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		try {
			const member = interaction.options.getMember('user');
			const timee = interaction.options.getString('time');
			const roleto = interaction.options.getRole('role');
			const reason = interaction.options.getString('reason') || 'Not provided';

			const role = member.roles.highest.position;
			const authorRole = interaction.member.roles.highest.position;

			if (interaction.options.getSubcommand() === 'add') {
				if (member.roles.cache.some((role) => role.name === roleto.name)) {
					const embed = new container.Discord.MessageEmbed()
						.setDescription(`> That user already has that role`)
						.setColor(client.embed.color.red);
					return interaction.reply({ embeds: [embed] });
				}

				if (roleto.managed) {
					const embed1 = new container.Discord.MessageEmbed()
						.setDescription(`> That role is managed from other bot`)
						.setColor(client.embed.color.red);
					return interaction.reply({ embeds: [embed1] });
				}

				if (role >= authorRole) {
					let embed5 = new container.Discord.MessageEmbed()
						.setDescription(`> You can't add role to someone with an equal or higher role`)
						.setColor(client.embed.color.red);
					return interaction.reply({
						embeds: [embed5],
					});
				}

				if (timee) {
					function setTimeFunction(func, time) {
						let date = new Date().getTime();
						date = time - date;
						if (date > 24 * 24 * 60 * 60 * 1000) {
							setTimeout(() => setTime(func, time), 24 * 24 * 60 * 60 * 1000);
						} else {
							setTimeout(func, date);
						}
					}

					let time = ms(timee);
					member.roles.add(roleto).catch(() => {});
					let data = await RoleTime.findOne({
						userID: member.user.id,
						guildID: interaction.guild.id,
					});
					if (!data) {
						data = await RoleTime.create({
							userID: member.user.id,
							guildID: interaction.guild.id,
						});
						await data.save();
					}
					time = new Date().getTime() + time;
					let index = data.data.findIndex((e) => e.role === roleto.id);
					if (index === -1) {
						await data.data.push({
							time: time,
							role: roleto.id,
						});
					} else {
						data.data[index].time = time;
					}
					await data.save();
					let embed = new container.Discord.MessageEmbed()

						.setDescription(
							`> Successfully added role ${roleto} to ${member} for ${humanizeDuration(ms(timee), {
								round: true,
							})}`,
						)
						.setColor(client.embed.color.green);
					interaction.reply({
						embeds: [embed],
					});

					setTimeFunction(async () => {
						let data1 = await RoleTime.findOne({
							userID: member.user.id,
							guildID: interaction.guild.id,
						});
						if (!data1) return;
						let index = data1.data.findIndex((e) => e.role === roleto.id);
						if (index === -1) return;
						data1.data.splice(index, 1);
						await data1.save().catch((err) => 0);
						await member.roles
							.remove(roleto)
							.catch((err) => 0)
							.catch(() => {});
						if (data1.data.length === 0) {
							await RoleTime.findOneAndDelete({
								userID: member.user.id,
								guildID: interaction.guild.id,
							});
						}
					}, time);
					return;
				}

				await member.roles.add(roleto, `By: ${interaction.user.tag} Reason: ${reason}`).catch(() => {});
				const embed3 = new container.Discord.MessageEmbed()
					.setDescription(`> Successfully added role ${roleto} to ${member}`)
					.setColor(client.embed.color.green);
				interaction.reply({ embeds: [embed3] });
			} else if (interaction.options.getSubcommand() === 'remove') {
				if (roleto.managed) {
					const embed4 = new container.Discord.MessageEmbed()
						.setDescription(`> That role is managed from other bot`)
						.setColor(client.embed.color.red);
					return interaction.reply({ embeds: [embed4] });
				}

				if (role > authorRole || role === authorRole) {
					let embed5 = new container.Discord.MessageEmbed()
						.setDescription(`> You can't remove role from someone with an equal or higher role`)
						.setColor(client.embed.color.red);
					return interaction.reply({
						embeds: [embed5],
					});
				}

				await member.roles.remove(roleto, `By: ${interaction.user.tag} Reason: ${reason}`).catch(() => {});

				const embed6 = new container.Discord.MessageEmbed()
					.setDescription(`> Successfully Removed the role ${roleto} from ${member}`)
					.setColor(client.embed.color.green);
				interaction.reply({ embeds: [embed6] });
			}
		} catch (err) {
			const embed = new container.Discord.MessageEmbed()
				.setDescription(`> Please check my permissions and Pull my role to up`)
				.setColor(client.embed.color.red);
			interaction.reply({ embeds: [embed] });
		}
	},
};
