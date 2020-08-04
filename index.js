/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json");

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const apiHandler = require("./handlers/api.handler")

apiHandler(client)



/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} jest ONLINE!`);
  client.user.setActivity(`${PREFIX}pomoc`, {type: "LISTENING"});
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  const { guild, channel } = message
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((command) => command.aliases && command.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `poczekaj ${timeLeft.toFixed(1)}sek  przed ponownym wpisaniem  \`${command.name}\`.`
      );
    }
  }

  
  if (command.botPermissions && command.botPermissions.length) {
    if (!guild.me.permissionsIn(channel).has(command.botPermissions)) {
      return channel.send(`Potrzebuje więcej uprawnień, aby wykonać komende.`)
    }
  }
  //Sprawdza uprawnienia usera
  if (command.userPermissions && command.userPermissions.length) {
    if (!message.member.permissionsIn(channel).has(command.userPermissions)) {
      return message.reply("Nie masz wymaganych uprawnień!")
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.run(message, args);
  } catch (error) {
    console.error(error);
    message.reply("Wystąpił błąd podczas wykonywania tego polecenia.").catch(console.error);
  }
});
