const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
  description: "Usuń piosenkę z kolejki",
  run(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("Nie ma kolejki").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`Użycie: ${message.client.prefix}remove <Numer kolejki>`);
    if (isNaN(args[0])) return message.reply(`Użycie: ${message.client.prefix}remove <Numer kolejki>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ usunął **${song[0].title}** z kolejki.`);
  }
};
