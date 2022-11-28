module.exports = {
	name: 'lockdown',
	description: 'Lock all channels in the server.',
	usage: ['lockdown [choose] <role> <reason>'],
	category: 'Moderation',
	cooldown: 60,
	requiredAnyRole: ['844345521481187338', '850492222566039582'],
	clientPermissions: ['MANAGE_CHANNELS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'choose',
			description: 'Lock all channels in the server.',
			type: 3,
			choices: [
				{
					name: 'Enable',
					value: 'enable',
				},
				{
					name: 'Disable',
					value: 'disable',
				},
			],
			required: true,
		},
		{
			name: 'role',
			description: 'The role to be skipped in lockdown.',
			type: 8,
		},
		{
			name: 'reason',
			description: 'reason for the lockdown.',
			type: 3,
		},
	],
	run: async (client, interaction, container) => {
		const choose = interaction.options.getString('choose');
		const reason = interaction.options.getString('reason') || 'No reason provided.';
		const role = interaction.options.getRole('role');

		const Channels = interaction.guild.channels;
		if (choose === 'enable') {
			Channels.cache.forEach((ch) => {
				ch.permissionOverwrites.edit(ch.guild.roles.everyone, {
					SEND_MESSAGES: false,
				});
				if (role) {
					ch.permissionOverwrites.create(role.id, {
						SEND_MESSAGES: true,
					});
				}
			});
			let embed = new container.Discord.MessageEmbed()
				.addField('<:note:963914219852558386> Lockdown', 'Lockdown is now **__Enabled__**.')
				.setColor(client.embed.color.green);
			if (role) {
				embed.addField('<:note:963914219852558386> Lockdown not applicable to this role:', `${role}`);
			}
			if (reason) {
				embed.addField('<:note:963914219852558386> Reason:', `${reason}`);
			}
			return interaction.reply({ embeds: [embed] });
		} else if (choose === 'disable') {
			const Channels = interaction.guild.channels;
			Channels.cache.forEach((ch) => {
				ch.permissionOverwrites.edit(ch.guild.roles.everyone, {
					SEND_MESSAGES: null,
				});
			});
			let embed1 = new container.Discord.MessageEmbed()
				.addField('<:note:963914219852558386> Lockdown', 'Lockdown is now **__Disabled__**.')
				.setColor(client.embed.color.green);
			if (role) {
				embed1.addField('<:note:963914219852558386> Lockdown not applicable to this role:', `${role}`);
			}
			if (reason) {
				embed1.addField('<:note:963914219852558386> Reason:', `${reason}`);
			}
			return interaction.reply({ embeds: [embed1] });
		}
	},
};
