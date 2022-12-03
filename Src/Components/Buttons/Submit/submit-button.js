const Button = require('../../../Structures/Button');
const UserSchema = require('../../../Database/Schema/User');
module.exports = class SubmitButton extends Button {
  constructor(client) {
    super(client, {
      id: 'submit-button',
    });
  }
  async run(client, interaction) {
    let User = await UserSchema.findOne({
      userId: interaction.user.id,
    });
    if (User) {
      const Embed = new client.Discord.EmbedBuilder()
        .setDescription(
          `You have submitted a request to join the team. Please wait for the competition to start. If you want to withdraw please contact <@685868171755913293>.`,
        )
        .setColor(client.config.Color.red);
      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    const Modal = new client.Discord.ModalBuilder().setCustomId('submit-button-modal').setTitle('Submit to Competition.');

    const MainRolesInput = new client.Discord.TextInputBuilder()
      .setCustomId('submit-button-mainroles-modal')
      .setLabel('Please Write Main Roles:')
      .setStyle(client.Discord.TextInputStyle.Short)
      .setMaxLength(800);
    const RiotIdInput = new client.Discord.TextInputBuilder()
      .setCustomId('submit-button-riotid-modal')
      .setLabel('Please Write Your Riot Id:')
      .setStyle(client.Discord.TextInputStyle.Short)
      .setMaxLength(200);

    const MainRolesRaw = new client.Discord.ActionRowBuilder().addComponents(MainRolesInput);
    const RiotIdRaw = new client.Discord.ActionRowBuilder().addComponents(RiotIdInput);
    Modal.addComponents(MainRolesRaw, RiotIdRaw);
    await interaction.showModal(Modal);
  }
};
