const crypto = require('crypto');
module.exports = {
	name: 'report-bug',
	description: 'Report a bug to the developers.',
	usage: ['report-bug [bug]'],
	category: 'Utility',
	cooldown: 5,
	clientPermissions: ['CREATE_INSTANT_INVITE', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'bug',
			description: 'Send a bug report to the developers',
			required: true,
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		const webhookClient = new container.Discord.WebhookClient({
			id: '954215312411209758',
			token: 'vpp-T9BU1FYrc2ZTI8lldqJgw5ZJ9jRKEwcEAizFJVmBiErbmu98LP2iS53jBeWTXPtO',
		});
		const BugText = interaction.options.getString('bug');

		if (BugText.length < 3) {
			let embed = new container.Discord.MessageEmbed()
				.setColor(client.embed.color.red)
				.setDescription('> Please provide us with more information about the bug!');
			return interaction.reply({ embeds: [embed] });
		}

		const ConfimHmm = new container.Discord.MessageActionRow().addComponents([
			new container.Discord.MessageButton().setCustomId('yes').setLabel('Yes').setStyle('DANGER'),
			new container.Discord.MessageButton().setCustomId('no').setLabel('No').setStyle('DANGER'),
		]);
		let embed1 = new container.Discord.MessageEmbed()
			.setColor(client.embed.color.orange)
			.setDescription(`> Are you sure you want to report this bug?`);
		interaction.reply({ embeds: [embed1], components: [ConfimHmm], fetchReply: true });

		const filter = (i) => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({
			filter: filter,
			time: 30000,
		});
		collector.on('collect', async (i) => {
			if (i.customId === 'yes') {
				const id = crypto.randomBytes(4).toString('hex');

				let invite = await interaction.channel
					.createInvite({
						maxAge: 0,
						maxUses: 0,
					})
					.catch(() => {});

				const InviteBug = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton()
						.setLabel(`Invite Link To Bug Report Guild`)
						.setStyle(`LINK`)
						.setURL(`${invite}`)
						.setEmoji('<:bug:938144202125107210>'),
				);
				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('<:bug:938144202125107210> Bug Report')
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
					.setDescription(BugText)
					.addField('User', `${interaction.user}`, true)
					.addField('User username', interaction.user.username, true)
					.addField('User ID', interaction.user.id, true)
					.addField('User Tag', interaction.user.tag, true)
					.addField('Server', `[${interaction.guild.name}](${invite || 'none '})`, true)
					.addField('Bug Report ID:', `#${id}`, true)
					.setColor(client.embed.color.onix)
					.setFooter({
						text: interaction.user.username + ' - Bug Report',
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					})
					.setTimestamp();
				webhookClient.send({
					embeds: [embed2],
					components: [InviteBug],
				});

				const InviteSupport = new container.Discord.MessageActionRow().addComponents(
					new container.Discord.MessageButton()
						.setLabel(`Support Server`)
						.setStyle(`LINK`)
						.setURL(`https://discord.gg/7V9cgntvak`)
						.setEmoji('<:link:938144203211427880>'),
				);
				const confirmation = new container.Discord.MessageEmbed()
					.setTitle('<:bug:938144202125107210> Bug Report')
					.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
					.setDescription(
						`Hey, the owner recieved the bug, make sure to let him know, kindly join the Support [**Server Support**](https://discord.gg/7V9cgntvak)`,
					)
					.addField('Member', `${interaction.user}`, true)
					.addField('Message Bug', BugText, true)
					.addField('Bug Report ID:', `#${id}`, true)
					.setColor(client.embed.color.onix)
					.setFooter({
						text: client.user.username + ' - Bug Report',
						iconURL: client.user.displayAvatarURL({ dynamic: true }),
					})
					.setTimestamp();

				let embed3 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.onix)
					.setDescription('> Thanks for hunter him ,Send inforomaion in your DM!');
				interaction.editReply({ embeds: [embed3], components: [] });

				interaction.user.send({ embeds: [confirmation], components: [InviteSupport] }).catch(() => {});
				collector.stop();
			}
			if (i.customId === 'no') {
				let embed = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription('> Bug report canceled!');
				return interaction.editReply({ embeds: [embed], components: [] });
			}
		});
		collector.on('end', (collected) => {
			if (collected.size === 0 && !collected.first()) {
				let embed4 = new container.Discord.MessageEmbed()
					.setColor(client.embed.color.red)
					.setDescription('> Bug report canceled!');
				return interaction.editReply({ embeds: [embed4], components: [] });
			}
		});
	},
};
