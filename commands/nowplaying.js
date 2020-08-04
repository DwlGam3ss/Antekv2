const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "Pokazuje piosenke, która aktualnie leci",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nic nie gra.").catch(console.error);
    const song = queue.songs[0];

    let nowPlaying = new MessageEmbed()
      .setTitle("Aktualnie gra")
      .setDescription(`[${song.title}](${song.url})`)
      .setColor("0xfcba03")


    return message.channel.send(nowPlaying);
  }
};
