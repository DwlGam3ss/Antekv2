const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "pomoc"],
  description: "Pokazuje wszystkie komendy i ich opisy.",
  run(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("Pomoc od Antka")
      .setDescription("Lista wszystkich komend")
      .setColor("0xfcba03");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
