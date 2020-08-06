const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js")

module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);


    if (!song) {
      setTimeout(() => {

        const brak = new MessageEmbed()
        .setTitle(`🟥 Wykryto brak aktywności.`)
        .setColor("0xfcba03")
    
        queue.channel.leave();
        message.channel.send(brak)
        setTimeout(() => {
          message.channel.bulkDelete(1)
      }, 20000);
    
        
      }, 60 * 5000);
      
        message.client.queue.delete(message.guild.id);
        return //queue.textChannel.send("koniec").catch(console.error);

    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 250);

    try {
      const song = queue.songs[0];
      const aktualnie = new MessageEmbed()
      .setTitle("Odtwarzam")
      .setDescription(`[${song.title}](${song.url})`)
      .setColor("0xfcba03")


      if (song.duration > 0) aktualnie.addField("Długość",new Date(song.duration * 1000).toISOString().substr(11, 8));
      
 
     // (`${song.url}`)

      var playingMessage = await queue.textChannel.send(aktualnie);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`${user} ⏩ pominął piosenkę`).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(`${user} ⏸ wstrzymał muzykę.`).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(`${user} ▶ wznowił piosenkę.`).catch(console.error);
          }
          break;


        case "🔁":
          const petla = new MessageEmbed()
          .setTitle("Pętla jest teraz")
          .setDescription(`${queue.loop ? "**Włączona**" : "**Wyłączona**"}`)
          .setColor("0xfcba03")
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;
          queue.textChannel.send(petla).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.songs = [];
          queue.textChannel.send(`${user} ⏹ wyrzucił bota i wyłączył piosenkę!`).catch(console.error);
          queue.connection.disconnect();
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
           // queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });
    

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
