module.exports = (permissions, channel, member, Discord) => {
  const missingPermissions = [];
  const ignoredPermissions = [Discord.PermissionsBitField.Flags.Connect, Discord.PermissionsBitField.Flags.Speak];
  const perms = channel.permissionsFor(member);
  for (const perm of permissions) {
    if (!perms.has(perm) && !ignoredPermissions.includes(perm)) {
      missingPermissions.push(perm);
    }
  }
  return new Discord.PermissionsBitField(missingPermissions).toArray();
};
