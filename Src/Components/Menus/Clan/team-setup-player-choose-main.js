const Menu = require('../../../Structures/Menu');
const UserSchema = require('../../../Database/Schema/User');
const TeamSchema = require('../../../Database/Schema/Team');

module.exports = class TeamSetupPlayerChooseMain extends Menu {
  constructor(client) {
    super(client, {
      id: 'team-setup-player-choose-main',
    });
  }
  async run(client, interaction) {
    let User = await UserSchema.findOne({
      userName: interaction.values,
    });

    let Team = await TeamSchema.findOne({
      teamLeader: interaction.user.id,
    });

    if (!Team) {
      const Embed = new client.Discord.EmbedBuilder()
        .setDescription(
          `Unfortunately, an error occurred in the bot. This Leader was not found in the database or you are not a Leader. Please report to <@685868171755913293>`,
        )
        .setColor(client.config.Color.red);
      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    if (!User) {
      const Embed = new client.Discord.EmbedBuilder()
        .setDescription(
          `Unfortunately, an error occurred in the bot. This user was not found in the database. Please report to <@685868171755913293>`,
        )
        .setColor(client.config.Color.red);
      return interaction.reply({ embeds: [Embed], ephemeral: true });
    }

    const Channel = await interaction.guild.channels.cache.get('1048028251244744784');

    const Embed = new client.Discord.EmbedBuilder()
      .setDescription(
        `**${interaction.values}** was successfully added to ID Team No. **${Team.teamId}**, who is responsible for Leader **<@${Team.teamLeader}>**`,
      )
      .setColor(client.config.Color.basicColor);
    Channel.send({ embeds: [Embed] });

    User.userStatus = true;
    User.teamId = Team.teamId;
    await User.save();

    Team.usersData.push(interaction.values);
    await Team.save();

    const Role = interaction.guild.roles.cache.get(Team.teamRoleId);
    const Fetched = await interaction.guild.members.fetch(User.userId, {
      force: true,
    });
    const MemberFetched = interaction.guild.members.cache.get(Fetched.id);
    MemberFetched.roles.add(Role)

    const Embed1 = new client.Discord.EmbedBuilder()
      .setDescription(`A player has been selected. Information has been sent to a channel <#1048028251244744784>`)
      .setColor(client.config.Color.basicColor);
    interaction.reply({
      embeds: [Embed1],
      ephemeral: true,
    });

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
      const TeamData = await TeamSchema.find({ userStatus: true }).sort({ 'Team.teamId': -1 });
      const Channel = await interaction.guild.channels.cache.get('1047647321749471263');

      const EmbedTeam = new client.Discord.EmbedBuilder()
        .setTitle('The Teams')
        .setDescription(
          TeamData.map(
            (cmd, i) => `**Team Name:** __${cmd.teamName}__ | **Team Id:** __${cmd.teamId}__\n${cmd.usersData.join('\n')}\n`,
          ).join('\n'),
        )
        .setColor(client.config.Color.basicColor);

      Channel.send({ embeds: [EmbedTeam] });

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
      return interaction.message.edit({
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

    return interaction.message.edit({
      embeds: [EmbedRebuild],
      components: [MenuRebuild, ButtonRebuild],
    });
  }
};
