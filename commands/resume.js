const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Wznów aktualnie odtwarzaną muzykę",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ wznowił piosenkę!`).catch(console.error);
    }

    return message.reply("Kolejka nie jest wstrzymana.").catch(console.error);
  }
};
