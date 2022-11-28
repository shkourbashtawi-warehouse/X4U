const FastRoleSchema = require('../../../Database/Other/FastRole');
module.exports = {
	name: 'fastrole',
	description: 'Short command use to give someone role and you can choose role one time',
	usage: ['fastrole [user]'],
	category: 'Moderation',
	cooldown: 3,
	requiredAnyRole: ['844345521481187338', '850492222566039582', '833499439145812038'],
	clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			name: 'user',
			description: 'The user you want to give him the role.',
			type: 6,
			required: true,
		},
	],
	run: async (client, interaction, container) => {
		const member = interaction.options.getMember('user');
		const settings = await FastRoleSchema.findOne({
			guildID: interaction.guild.id,
			toggleStatus: true,
		});
		if (!settings) {
			const embed = new container.Discord.MessageEmbed()
				.setTitle('FastRole System | Role Setup')
				.setDescription(`You are not setup FastRole System or Disable System, see \`/setup-help\` for more info`)
				.setColor(client.embed.color.red);
			return interaction.reply({
				embeds: [embed],
			});
		}
		if (settings) {
			const role = interaction.guild.roles.cache.get(settings.roleID);
			if (!role) {
				const embed = new container.Discord.MessageEmbed()
					.setTitle('FastRole System | Role Setup')
					.setDescription(`You are not setup FastRole System, see \`/setup-help\` for more info`)
					.setColor(client.embed.color.red);
				return interaction.reply({
					embeds: [embed],
				});
			}
			if (role) {
				member.roles.add(role);
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`**${member.user.tag}** has been given **${role}** role`)
					.setColor(client.embed.color.green);
				return interaction.reply({
					embeds: [embed],
				});
			}
		}
	},
};
