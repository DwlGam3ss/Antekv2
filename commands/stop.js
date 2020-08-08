const { canModifyQueue, botChannel } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  description: "Wyłącza piosenke",
  async run(message) {

    const queue = message.client.queue.get(message.guild.id);
    const { channel } = message.member.voice;

    if (!queue === botChannel)connection.disconnect();
      if (!queue) return message.reply("Nic nie gra.").catch(console.error);
      if (!canModifyQueue(message.member)) return;
      
      



    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ wyrzucił i wyłączył piosenkę!`).catch(console.error);
    queue.connection.disconnect();
  }
};
