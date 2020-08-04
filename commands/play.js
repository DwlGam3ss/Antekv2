const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Odtwarza dźwięk z YouTube lub Soundcloud",
  async run(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("Najpierw musisz dołączyć do kanału głosowego!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`Musisz być na tym samym kanale, co ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`Użycie: ${message.client.prefix}play <YouTube URL | Nazwa wideo | Soundcloud URL>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("Nie można połączyć się z kanałem głosowym, brak uprawnień");
    if (!permissions.has("SPEAK"))
      return message.reply("Nie mogę mówić w tym kanale głosowym, upewnij się, że mam odpowiednie uprawnienia!");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").run(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: trackInfo.duration
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.reply("Nie udało się znaleźć tego utworu Soundcloud.").catch(console.error);
        return message.reply("Wystąpił błąd podczas odtwarzania tego utworu Soundcloud.").catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply("Nie znaleziono filmu o pasującym tytule").catch(console.error);
      }
    }

    const kolejka = new MessageEmbed()
    .setTitle(`✅ ${song.title}`)
    .setDescription(`zostało dodane do kolejki przez ${message.author}`)
    .setColor("0xfcba03")
    .setURL(song.url)
    .setTimestamp()

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(kolejka)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`Nie udało się dołączyć do kanału: ${error}`).catch(console.error);
    }
  }
};
