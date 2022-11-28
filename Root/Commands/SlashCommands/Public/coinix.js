const userSchema = require('../../../Database/Economy/UserCredit');
module.exports = {
	name: 'coinix',
	description: 'To find out your coinix or someone else`s',
	usage: ['coinix <user>'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'The user to find the coinix of',
			type: 6,
		},
		{
			name: 'amount',
			description: 'amount to transfer',
			type: 10,
		},
	],
	run: async (client, interaction, container) => {
		const member = interaction.options.getUser('user') || interaction.user;
		const amount = interaction.options.getNumber('amount');

		if (!(Date.now() - member.createdTimestamp > 60 * 1e3 * 60 * 24 * 60)) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(
					`> Transfer of coinix from new accounts or to new accounts is temporarily disabled!\n> The account must be 2 months old.\n> Account age: <t:${parseInt(
						member.createdAt / 1000,
					)}:R>`,
				);
			return interaction.reply({ embeds: [embed] });
		}

		if (amount === undefined || amount < 0) {
			const embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription(`> You need to specify a valid amount of coinixs to transfer`);
			return interaction.reply({ embeds: [embed] });
		}

		if (member && !amount) {
			if (member.bot) {
				const botEmbed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription(`> Bots do not have coinixs!`);
				return interaction.reply({ embeds: [botEmbed] });
			}

			const userData = await userSchema.findOne({ userID: member.id });

			if (!userData) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`> <:coinix:963914221513474088> | **${member.username}**, your account balance is \`$0\` .`)
					.setColor(client.embed.color.onix);
				return interaction.reply({ embeds: [embed] });
			}

			if (userData) {
				const embed1 = new container.Discord.MessageEmbed()
					.setDescription(
						`> <:coinix:963914221513474088> | **${member.username}**, your account balance is \`$${userData.wallet}\` .`,
					)
					.setColor(client.embed.color.onix);
				return interaction.reply({ embeds: [embed1] });
			}
		}

		if (member && amount) {
			if (member.id === interaction.user.id) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`> You can't transfer coinix to yourself.`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			if (member.bot) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`> bots don't have an account.`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			const userTrasfer = await userSchema.findOne({ userID: member.id });
			const userData = await userSchema.findOne({ userID: interaction.user.id });

			if (!userData) {
				const embed = new container.Discord.MessageEmbed()
					.setDescription(
						`> **${interaction.user.username}**, You can't transfer coinix because you dont have a coinix use \`/daily\`.`,
					)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed] });
			}

			if (!userTrasfer) {
				userSchema
					.findOne({
						userID: member.id,
					})
					.then((doc) => {
						if (!doc) {
							const NewUser = new userSchema({
								userID: member.id,
								dailyAt: 0,
								wallet: 0,
								bank: 0,
							});
							NewUser.save();
						}
					});
			}

			if (userData.wallet < amount) {
				const embed3 = new container.Discord.MessageEmbed()
					.setDescription(`> **${interaction.user.username}**, Your balance is not enough for that.`)
					.setColor(client.embed.color.red);
				return interaction.reply({ embeds: [embed3] });
			}

			if (userData.wallet >= amount) {
				const ConfigBeforeButton = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton().setLabel('Transfer').setStyle('PRIMARY').setCustomId('transfer-yes'),
					new container.Discord.MessageButton().setLabel('Cancel').setStyle('DANGER').setCustomId('transfer-no'),
				);

				const FinalAmount = Math.ceil(amount - amount * 0.05);

				const ConfigBeforeEmbed = new container.Discord.MessageEmbed()
					.setTitle(`Confirm Transfer`)
					.setDescription(
						`> 🤔 | **${interaction.user.username}** you are about to transfer \`$${FinalAmount}\` to **${member.username}**!`,
					)
					.setColor(client.embed.color.orange);
				const FetchInteracion = await interaction.reply({
					embeds: [ConfigBeforeEmbed],
					components: [ConfigBeforeButton],
					fetchReply: true,
				});
				const filter = (i) => i.user.id === interaction.user.id;
				const collector = FetchInteracion.createMessageComponentCollector({
					filter: filter,
					time: 10000,
				});

				collector.on('collect', async (i) => {
					if (i.customId === 'transfer-yes') {
						userSchema
							.findOne({
								userID: member.id,
							})
							.then((doc) => {
								if (!doc) {
									const NewUser = new userSchema({
										userID: member.id,
										dailyAt: 0,
										wallet: 0,
										bank: 0,
									});
									userData.wallet -= amount;
									NewUser.wallet += FinalAmount;
									NewUser.save();
									userData.save();
								} else {
									userData.wallet -= amount;
									doc.wallet += FinalAmount;
									doc.save();
									userData.save();
								}
							});
						const embed4 = new container.Discord.MessageEmbed()
							.setDescription(
								`> <:earth:938144201424658482> | **${interaction.user.username}**, You have successfully transferred \`$${FinalAmount}\` to **${member.username}**`,
							)
							.setColor(client.embed.color.onix);
						interaction.editReply({ embeds: [embed4], components: [] });
						try {
							const embed5 = new container.Discord.MessageEmbed()
								.setDescription(
									`\`\`\`css\nYou have received $${FinalAmount} from ${interaction.user.username} in ${interaction.guild.name}!\nID-User: (${interaction.user.id})\nID-Guild: (${interaction.guild.id})\`\`\``,
								)
								.setColor('#303136');
							await member.send({ embeds: [embed5] });
						} catch (err) {
							return;
						}
						return;
					}
					if (i.customId === 'transfer-no') {
						const embed6 = new container.Discord.MessageEmbed()
							.setDescription(`> Transfer canceled.`)
							.setColor(client.embed.color.red);
						return interaction.editReply({ embeds: [embed6], components: [] });
					}
					collector.stop();
				});
				collector.on('end', () => {
					if (collector.collected.size === 0) {
						const embed7 = new container.Discord.MessageEmbed()
							.setDescription(`> Transfer canceled.`)
							.setColor(client.embed.color.red);
						return interaction.editReply({ embeds: [embed7], components: [] });
					}
				});
			}
		}
	},
};
