# 『 Changelog 』

[**Click here to visit the latest changelog and checkout the changes done.**](Documentation/Changelog.md)

# 『 Features 』

- Chalk Logging
- Organized layout and easily customizable.
- Includes `MessageCommands` , `SelectMenus` , `Buttons` , `ContextMenus` and `SlashCommands` handler.
- Inbuilt many command options that can be applied to all types of commands. (They will not work on events.)
- Frequent updates to stay as upto date as possible.

# 『 Important Notes 』

- [**NodeJS**](https://nodejs.org) V16 and above.
- `ContextMenus` and `SlashCommands` take 5 second each command file to create and update because of Discord's Ratelimit. But the `run()` function is updated immediately on startup so if you only need to update existing command code then it will be done instantly so thats a nice thing :D.
- Global commands can take upto a hour to update because that's how Discord made global commands so we can't do anything about it.
- These are the collections where events and commands are stored.

```js
client.events; //Events Collection
client.commands.messageCommands; //Message / Normal commands collection.
client.commands.messageCommands.aliases; //Message / Normal command's aliases.
client.commands.slashCommands; //Slashcommands collection.
client.commands.contextMenus; //contextMenus collection.
client.commands.selectMenus; //SelectMenus collection.
client.commands.buttonCommands; //Buttons collection
```

# 『 Setup / Configuration 』

- Install the required modules using the command `npm i` in your console and wait for it to finish.
- Fill all the fields in `Config.js`.
- Use the command `node bot.js` or `node .` to start the bot and enjoy :D

# 『 Documentation 』

## 『 Events Documentation 』

- [**Client Events**](Documentation/Events/ClientEvents.md)
- [**Non-Client Events**](Documentation/Events/CustomEvents.md)

## 『 Commands Documentation 』

- [**MessageCommands**](Documentation/Commands/MessageCommands.md)
- [**SlashCommands**](Documentation/Commands/SlashCommands.md)
- [**ContextMenus**](Documentation/Commands/ContextMenus.md)
- [**SelectMenus**](Documentation/Commands/SelectMenus.md)
- [**Buttons**](Documentation/Commands/ButtonCommands.md)

## 『 CommandOptions Documentation 』

- [**   **](Documentation/CommandOptions/ReturnNoErrors.md)
- [**AnyClientPermissions**](Documentation/CommandOptions/AnyClientPermissions.md)
- [**AnyUserPermissions**](Documentation/CommandOptions/AnyUserPermissions.md)
- [**ClientPermissions**](Documentation/CommandOptions/ClientPermissions.md)
- [**UserPermissions**](Documentation/CommandOptions/UserPermissions.md)
- [**Cooldown**](Documentation/CommandOptions/Cooldown.md)
- [**OnlyChannels**](Documentation/CommandOptions/OnlyChannels.md)
- [**OnlyGuilds**](Documentation/CommandOptions/OnlyGuilds.md)
- [**OnlyUsers**](Documentation/CommandOptions/OnlyUsers.md)
- [**OwnerOnly**](Documentation/CommandOptions/OwnerOnly.md)
- [**RequiredAnyRole**](Documentation/CommandOptions/RequiredAnyRole.md)
- [**RequiredRoles**](Documentation/CommandOptions/RequiredRoles.md)
