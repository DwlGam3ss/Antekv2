const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Zmień głośność piosenek",
  run(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("Nic nie gra").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("Musisz najpierw dołączyć do kanału głosowego!").catch(console.error);

      const cvol = new MessageEmbed()
      .setTitle("🔊Aktualna głośność")
      .setDescription(`**${queue.volume}%**`)
      .setColor("0xfcba03")
  

    if (!args[0]) return message.reply(cvol).catch(console.error);
    if (isNaN(args[0])) return message.reply("Użyj liczby do ustawienia głośności.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Użyj liczby od 0 do 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    const vol = new MessageEmbed()
    .setTitle("🔊Głośność ustawiona na")
    .setDescription(`**${args[0]}%**`)
    .setColor("0xfcba03")

    return queue.textChannel.send(vol).catch(console.error);
  }
};
