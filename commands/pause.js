const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "Wstrzymaj aktualnie odtwarzaną piosenkę",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("Nic nie gra.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸ zatrzymał piosenkę.`).catch(console.error);
    }
  }
};
