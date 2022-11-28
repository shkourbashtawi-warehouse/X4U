const ms = require('ms');
const humanizeDuration = require('humanize-duration');
module.exports = {
	name: 'mute-timeout',
	description: 'Timeout user from typing or joining voice channel or react to messages.',
	usage: ['mute-timeout on/off [user] [time] <reason>'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
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
					name: 'time',
					description: 'Time for user to timeout. example: (1m, 1d, 1mo)..',
					type: 3,
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
		const time = interaction.options.getString('time');
		const reason = interaction.options.getString('reason') || 'No provided reason.';
		const member = interaction.guild.members.cache.get(user.id);

		const role = user.roles.highest.position;
		const authorRole = interaction.member.roles.highest.position;

		if (role >= authorRole) {
			let embed3 = new container.Discord.MessageEmbed()
				.setDescription("> You can't use timeout a member who has the same role as you or a higher role than you.")
				.setColor(client.embed.color.red);
			return interaction.reply({ embeds: [embed3] });
		}

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
				.disableCommunicationUntil(Date.now() + ms(time), `By: ${interaction.user.tag} | Reason: ${reason}`)
				.catch(console.error);

			let embed2 = new container.Discord.MessageEmbed()
				.setDescription(
					`> ${user} has been timeout for **${humanizeDuration(ms(time), {
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
