const ToggleCommandDevSchema = require('../../../Database/Other/ToggleCommandDev');
module.exports = {
	name: 'togglecommand',
	category: 'Developers',
	onlyUsers: ['685868171755913293', '913497938129469461', '760285856811974656', '787956837403197510'],
	returnOnlyUsers: false,
	run: async (client, message, args, container) => {
		if (
			message.author.id === '685868171755913293' ||
			message.author.id === '913497938129469461' ||
			message.author.id === '760285856811974656' ||
			message.author.id === '787956837403197510'
		) {
			const ToggleCommandDev = await ToggleCommandDevSchema.findOne({ Command: args[0] });
			if (!ToggleCommandDev) {
				const newToggleCommandDev = new ToggleCommandDevSchema({ Command: args[0], toggleStatus: true });
				newToggleCommandDev.save();
				const embed = new container.Discord.MessageEmbed()
					.setDescription(`> Command ${args[0]} It is now disabled, Use this command again to enable command.`)
					.setColor(client.embed.color.onix);
				return message.reply({ embeds: [embed] });
			} else if (ToggleCommandDev) {
				await ToggleCommandDevSchema.findOneAndDelete({
					Command: args[0],
				});

				const embed2 = new container.Discord.MessageEmbed()
					.setDescription(`> Command ${args[0]} It is now enabled, Use command again to disable command.`)
					.setColor(client.embed.color.onix);
				return message.reply({ embeds: [embed2] });
			}
		}
	},
};
