const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Zapętla piosenkę lub playliste.",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nic nie gra.").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    const petla = new MessageEmbed()
    .setTitle("Pętla jest teraz")
    .setDescription(`${queue.loop ? "**Włączona**" : "**Wyłączona**"}`)
    .setColor("0xfcba03")

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(petla)
      .catch(console.error);
  }
};
