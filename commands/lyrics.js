const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: "Get lyrics for the currently playing song",
  async run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Nic nie gra.").catch(console.error);

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `Nie znalazłem tekstu dla ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `Nie znalazłem tekstu dla ${queue.songs[0].title}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle("Tekst piosenki")
      .setDescription(lyrics)
      .setColor("0xfcba03")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
