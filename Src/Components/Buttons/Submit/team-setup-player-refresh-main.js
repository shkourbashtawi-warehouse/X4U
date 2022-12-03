const Button = require('../../../Structures/Button');
const UserSchema = require('../../../Database/Schema/User');
module.exports = class TeamSetupPlayerRefreshMain extends Button {
  constructor(client) {
    super(client, {
      id: 'team-setup-player-refresh-main',
    });
  }
  async run(client, interaction) {
    const MenuRebuild = new client.Discord.ActionRowBuilder().addComponents(
      new client.Discord.StringSelectMenuBuilder({
        placeholder: 'Please choose one player only.',
        customId: 'team-setup-player-choose-main',
        maxValues: 1,
      }),
    );
    const ButtonRebuild = new client.Discord.ActionRowBuilder().addComponents(
      new client.Discord.ButtonBuilder()
        .setCustomId('team-setup-player-refresh-main')
        .setLabel('Refresh')
        .setStyle(client.Discord.ButtonStyle.Danger),
    );
    const EmbedRebuild = new client.Discord.EmbedBuilder()
      .setTitle('Players Selection')
      .setDescription(
        `Welcome to the player selection stage. Now players are being selected by the Team Leader.\n**__Please follow the management notes__**\n**__The members in the menu have also been refreshed__**`,
      )
      .setColor(client.config.Color.basicColor);

    const UsersData = await UserSchema.find({ userStatus: false });

    if (UsersData.length == 0) {
      const MenuRebuild = new client.Discord.ActionRowBuilder().addComponents(
        new client.Discord.StringSelectMenuBuilder({
          placeholder: 'The Selection is Completed',
          customId: 'team-setup-player-choose-done-main',
          maxValues: 1,
          options: [
            {
              label: 'End',
              value: 'end',
              emoji: '🖼️',
            },
          ],
          disabled: true,
        }),
      );
      const ButtonRebuild = new client.Discord.ActionRowBuilder().addComponents(
        new client.Discord.ButtonBuilder()
          .setCustomId('team-setup-player-refresh-done-main')
          .setLabel('Refresh')
          .setStyle(client.Discord.ButtonStyle.Danger)
          .setDisabled(true),
      );
      const EmbedRebuild = new client.Discord.EmbedBuilder()
        .setTitle('The Selection is Completed')
        .setDescription(
          `Thank you for your cooperation with us, and now there is no one left to choose, to see teams, please go to the channel <#1047647321749471263>`,
        )
        .setColor(client.config.Color.basicColor);
      return interaction.update({
        embeds: [EmbedRebuild],
        components: [MenuRebuild, ButtonRebuild],
      });
    }

    let UsernameFromDatabase = [];
    for (let i = 0; i < UsersData.length; i++) {
      UsernameFromDatabase.push(UsersData[i].userName);
    }

    UsernameFromDatabase.forEach((i) => {
      MenuRebuild.components[0].addOptions({
        label: i,
        value: i,
      });
    });

    return interaction.update({
      embeds: [EmbedRebuild],
      components: [MenuRebuild, ButtonRebuild],
    });
  }
};
