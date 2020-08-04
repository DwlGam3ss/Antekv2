const { MessageEmbed, Permissions: { FLAGS } } = require("discord.js")

module.exports = {
    name: "wyczysc",
    description: "Usuwanie wiadomości z kanału tekstowego.",
    aliases: ["clear"],
    args: true,
    usage: "<liczba>",
    guildOnly: true,
    cooldown: 10,
    botPermissions: [FLAGS.MANAGE_MESSAGES],
    userPermissions: [FLAGS.MANAGE_MESSAGES],

     run(msg, args) {
        const { channel, member, guild } = msg 

    const amount = parseInt(args[0])

    if (!Number.isInteger(amount)) {
        return channel.send(`Podaj liczbę wiadomości jaką chcesz usunąć, ${msg.author}!`)
    }

    if (amount < 2 || amount > 100) {
        return channel.send("Ilość wiadomości do usunięcia musi być większa od 1 i mniejsza od 100")

    }


      channel.bulkDelete(amount)

      const commandName = "Wyczyść"
      const Description = `Usunięto, ${amount} wiadomości!`
  
      const wyczysc =  new MessageEmbed()
      .setTitle(commandName)
      .setColor(0xfcba03)
      .setDescription(Description)
      .setTimestamp()
    channel.send(wyczysc)
setTimeout(() => {
    channel.bulkDelete(1)
}, 5000);
    
    }
}