const AutoRoleSchema = require('../../../Database/Other/AutoRole');
module.exports = {
	name: 'setup-autorole',
	description: 'Setup the auto role | (see /setup-help for more info)',
	usage: ['/help setup'],
	category: 'Setup',
	cooldown: 10,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'role',
			description: 'With this option you can input Role in Database.',
			type: 1,
			options: [
				{
					name: 'role',
					description: 'What Role do you want input in Database',
					type: 8,
					required: true,
				},
			],
		},
		{
			name: 'toggle',
			description: 'With this option you can turn on or off Autorole.',
			type: 1,
			options: [
				{
					name: 'choice',
					description: 'Choose true(Enable) or false(Disable).',
					type: 5,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'role') {
			const role = interaction.options.getRole('role');

			const RolePosition = role.position;
			const authorRole = interaction.member.roles.highest.position;

			if (RolePosition > authorRole) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('AutoRole System | Role Setup')
					.setDescription(`> You cant use this role because it's higher than your role`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed],
				});
			}

			AutoRoleSchema.findOne({ guildId: interaction.guild.id }, async (err, data) => {
				if (data) {
					new AutoRoleSchema({
						guildId: interaction.guild.id,
						roleObject: role.id,
						toggleStatus: true,
					}).save();
				} else {
					new AutoRoleSchema({
						guildId: interaction.guild.id,
						roleObject: role.id,
						toggleStatus: true,
					}).save();
				}
			});
			const embed1 = new container.Discord.MessageEmbed()
				.setTitle('AutoRole | Role Setup')
				.setDescription(`> AutoRole Enable for ${role} Role , Use command again to update Autorole Role`)
				.setColor(client.embed.color.green);
			return interaction.reply({
				embeds: [embed1],
			});
		}

		if (interaction.options.getSubcommand() === 'toggle') {
			const toggle = interaction.options.getBoolean('choice');
			const settings = await AutoRoleSchema.findOne({
				guildID: interaction.guild.id,
			});

			if (!settings) {
				const newSettings = new AutoRoleSchema({
					guildID: interaction.guild.id,
					toggleStatus: toggle,
				});
				await newSettings.save();
				const embed2 = new container.Discord.MessageEmbed()
					.setTitle('AutoRole System | Toggle Setup')
					.setDescription(`> AutoRole toggle update to **${toggle}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed2],
				});
			}
			if (settings) {
				settings.toggleStatus = toggle;
				await settings.save();
				const embed3 = new container.Discord.MessageEmbed()
					.setTitle('Auto Role System | Toggle Setup')
					.setDescription(`> AutoRole toggle update to **${toggle}**`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed3],
				});
			}
		}
	},
};
