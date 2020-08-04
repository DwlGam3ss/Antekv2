const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Pomiń obecną piosenkę",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("Nie ma nic, co mógłbym dla ciebie pominąć.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ pominął piosenkę`).catch(console.error);
  }
};
