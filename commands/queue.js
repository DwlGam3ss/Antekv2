const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  description: "Pokazuje kolejkę piosnek.",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nic nie gra").catch(console.error);

    const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);

    let queueEmbed = new MessageEmbed()
      .setTitle("Antek kolejka muzyczna")
      .setDescription(description)
      .setColor("0xfcba03");

    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });

    splitDescription.forEach(async (m) => {
      queueEmbed.setDescription(m);
      message.channel.send(queueEmbed);
    });
  }
};
