const MaintenanceScehma = require('../../../Database/Other/Maintenance.js');
module.exports = {
	name: '911',
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
			const Maintenance = await MaintenanceScehma.findOne({ Maintenance: 'Maintenance' });
			if (!Maintenance) {
				const newMaintenance = new MaintenanceScehma({ Maintenance: 'Maintenance', toggleStatus: false });
				newMaintenance.save();
			}

			if (args[0] === 'enable' || args[0] === 'on') {
				Maintenance.toggleStatus = true;
				await Maintenance.save();
				const EmbedON = new container.Discord.MessageEmbed()
					.setDescription(`> Maintenance is now **__Enabled__**.`)
					.setColor(client.embed.color.onix);
				return message.reply({ embeds: [EmbedON] });
			}

			if (args[0] === 'disable' || args[0] === 'off') {
				if (Maintenance.toggleStatus === true) {
					Maintenance.toggleStatus = false;
					await Maintenance.save();
					const EmbedOFF = new container.Discord.MessageEmbed()
						.setDescription(`> Maintenance is now **__Disable__**.`)
						.setColor(client.embed.color.onix);
					return message.reply({ embeds: [EmbedOFF] });
				}
			}
		}
	},
};
