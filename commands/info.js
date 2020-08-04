const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "info",
    description: "Pokazuje informacje o bocie!",

    run(message) {
 

            const botAuthor = "DwlGam3ss"
            const botVersion = "v1.0"
            const botName = "Antek"
            const botDescription = "Narazie dużo nie potrafi, ale ciągle sie rozwija."
        
            const embed = new MessageEmbed()
            .setTitle(botName)
            .setColor(0xffbd08)
            .setDescription(botDescription)
            .addField("Autor", botAuthor)
            .addField("Wersja", botVersion)
            .setTimestamp()
           
        message.channel.send(embed)
    },
}     
       