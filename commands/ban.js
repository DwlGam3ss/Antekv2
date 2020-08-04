const { MessageEmbed, Permissions: { FLAGS } } = require("discord.js")

module.exports = {
    name: "ban",
    description: "Banowanie użytkowników",
    args: true,
    usage: "<użytkownik> [dni(0-7)] [powód]",
    botPermissions: [FLAGS.BAN_MEMBERS],
    userPermissions: [FLAGS.BAN_MEMBERS],

    run(msg, args) {
        const { channel, guild, author, mentions } = msg 

        let daysArg = +args[1]

        
        if (!isNaN(daysArg)) {
            if (daysArg < 0) daysArg = 0
            if (daysArg > 7) daysArg = 7
        }
        
        const reasonArg = [...args].slice(isNaN(daysArg) ? 1 : 2).join(" ")
        const userToBan = mentions.users.first()

        if (!userToBan) {
            return msg.reply("musisz podać poprawną nazwe użytkownika do zbanowania.")  
        }

        if (userToBan.id === author.id) {
            return msg.reply("nie możesz zbanować samego siebie!")
        }

        const memberToBan = guild.members.cache.get(userToBan.id)

        if (!memberToBan.bannable) {
            return channel.send("Potrzebuje więcej uprawnień aby wykonać tą komende.")
        }

        const banOptions = {
            reason: reasonArg
        }

        if (!isNaN(daysArg)) banOptions.days = daysArg

        memberToBan.ban(banOptions).then((bannedres) => {

        const commandName = "Zbanowano użytkownika"
        const description = `Użytkownik **${bannedres.user.username}#${bannedres.user.discriminator}** został zbanowany.${reasonArg ? `\nPowód: ${reasonArg}` : ""}`

        const embed = new MessageEmbed()
        .setTitle(commandName)
        .setColor(0xfcba03)
        .setDescription(description)
        .addField("Kto zbanował", msg.author.tag)
        .setTimestamp()

            channel.send(embed)
        })




    }
}