const ms = require('ms');
const humanizeDuration = require('humanize-duration');
module.exports = {
	name: 'joke-timeout',
	description: 'Timeout user from typing or joining voice channel or react to messages.',
	usage: ['joke-timeout on/off [user] [time] <reason>'],
	category: 'Public',
	cooldown: 86400,
	requiredAnyRole: ['799487104026542151'],
	clientPermissions: ['MODERATE_MEMBERS', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'on',
			description: 'Timeout user from typing or joining voice channel or react to messages.',
			type: 1,
			options: [
				{
					name: 'user',
					description: 'The User to timeout.',
					type: 6,
					required: true,
				},
				{
					name: 'reason',
					description: 'Optional timeout reason.',
					type: 3,
				},
			],
		},
		{
			name: 'off',
			description: 'Un-Timeout user from typing or joining voice channel or react to messages.',
			type: 1,
			options: [
				{
					name: 'user',
					description: 'The User to Un-timeout.',
					type: 6,
					required: true,
				},
				{
					name: 'reason',
					description: 'Optional Un-timeout reason.',
					type: 3,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		const user = interaction.options.getMember('user');
		const reason = interaction.options.getString('reason') || 'No provided reason.';
		const member = interaction.guild.members.cache.get(user.id);

		if (interaction.options.getSubcommand() === 'on') {
			if (member.isCommunicationDisabled()) {
				let embed1 = new container.Discord.MessageEmbed()
					.setDescription(`> ${user} is already muted.`)
					.setColor(client.embed.color.red);

				return interaction.reply({
					embeds: [embed1],
				});
			}
			await member
				.disableCommunicationUntil(Date.now() + ms('3m'), `By: ${interaction.user.tag} | Reason: ${reason}`)
				.catch(console.error);

			let embed2 = new container.Discord.MessageEmbed()
				.setDescription(
					`> ${user} has been timeout for **${humanizeDuration(ms('3m'), {
						round: true,
					})}.**`,
				)
				.setColor(client.embed.color.green);

			return interaction.reply({
				embeds: [embed2],
			});
		} else if (interaction.options.getSubcommand() === 'off') {
			await member.disableCommunicationUntil(null, `By: ${interaction.user.tag} | Reason: ${reason}`);

			let embed3 = new container.Discord.MessageEmbed()
				.setDescription(`> Timeout has been removed from ${user}`)
				.setColor(client.embed.color.green);

			return interaction.reply({
				embeds: [embed3],
			});
		}
	},
};
