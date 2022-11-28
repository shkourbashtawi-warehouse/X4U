const permissions = require('../../../../Assets/permissions.json');
const Util = require('../../../Utils/Function');
module.exports = {
	name: 'user',
	description: 'Information about a user.',
	usage: ['user user/permssion <user>'],
	category: 'Public',
	cooldown: 5,
	clientPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
	options: [
		{
			type: 1,
			name: 'info',
			description: 'The user you want to get information about.',
			options: [
				{
					type: 6,
					name: 'user',
					description: 'User to get info about.',
					requested: true,
				},
			],
		},
		{
			type: 1,
			name: 'permssion',
			description: 'Shows a user permissions.',
			options: [
				{
					type: 6,
					name: 'user',
					description: 'The user you want to snipe him..',
					requested: true,
				},
			],
		},
	],
	run: async (client, interaction, container) => {
		if (interaction.options.getSubcommand() === 'info') {
			const member = interaction.options.getMember('user') || interaction.member;
			const memberAvatar = member.avatarURL({ dynamic: true }) || member.user.displayAvatarURL({ dynamic: true });

			let Roles = member.roles.cache
				.filter((r) => r.id != interaction.guild.id)
				.sort((a, b) => b.position - a.position)
				.map((role) => role.toString())
				.slice(0, -1);

			const embed = new container.Discord.MessageEmbed()
				.setAuthor({
					name: member.user.tag,
					iconURL: member.user.displayAvatarURL({ dynamic: true }),
				})
				.setThumbnail(memberAvatar)
				.setColor(client.embed.color.onix)
				.addFields(
					{
						name: '<:note:963914219852558386> User Created At:',
						value: `> <t:${parseInt(member.user.createdAt / 1000)}> (<t:${parseInt(
							member.user.createdTimestamp / 1000,
						)}:R>)`,
						inline: false,
					},
					{
						name: '<:note:963914219852558386> Joined Server At:',
						value: `> <t:${parseInt(member.joinedTimestamp / 1000)}> (<t:${parseInt(
							member.joinedTimestamp / 1000,
						)}:R>)`,
						inline: false,
					},
					{
						name: '<:note:963914219852558386> User Roles:',
						value: Roles.length < 10 ? Roles.join(' **|** ') : Roles.length > 10 ? Util.trimArray(Roles) : 'None',
					},
					{
						name: `<:note:963914219852558386> Highest Role [${member.roles.highest.position}/${interaction.guild.roles.highest.position}]:`,
						value: `> ${member.roles.highest} \`[${member.roles.highest.id}]\``,
					},
				)

				.setFooter({
					text: `ID User: ` + member.id,
					iconURL: member.displayAvatarURL({ dynamic: true }),
				});
			if (member.nickname) {
				embed.addField('<:note:963914219852558386> User Nickname:', member.nickname);
			}
			if (member.communicationDisabledUntilTimestamp) {
				embed.addField(
					'<:note:963914219852558386> Timeout Left:',
					`\`${member.communicationDisabledUntil.toLocaleString()}\` | **<t:${Math.floor(
						member.communicationDisabledUntilTimestamp / 1000,
					)}:R>**`,
				);
			}
			return interaction.reply({ embeds: [embed] });
		}

		if (interaction.options.getSubcommand() === 'permssion') {
			const user = interaction.options.getUser('user') || interaction.user;
			let member = interaction.guild.members.cache.get(user.id);
			const memberPermissions = member.permissions.toArray();
			const finalPermissions = [];
			for (const permission in permissions) {
				if (memberPermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
				else finalPermissions.push(`- ${permissions[permission]}`);
			}

			const embed = new container.Discord.MessageEmbed()
				.setTitle(`${member.displayName}'s Permissions`)
				.setDescription(`\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
				.setColor(client.embed.color.onix)
				.setFooter({
					text: client.embed.text.setFooter + interaction.user.username,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp()
				.setColor(client.embed.color.green);
			return interaction.reply({ embeds: [embed] });
		}
	},
};
