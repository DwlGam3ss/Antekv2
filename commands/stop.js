const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  description: "Wyłącza piosenke",
  run(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("Nic nie gra.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ wyłączył piosenkę!`).catch(console.error);
  }
};
