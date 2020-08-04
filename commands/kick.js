const { MessageEmbed, Permissions: { FLAGS } } = require("discord.js")

module.exports = {
    name: "wyrzuc",
    description: "Wyrzucanie członków",
    aliases: ["kick"],
    args: true,
    usage: "<użytkownik> [powód]",
    botPermissions: [FLAGS.KICK_MEMBERS],
    userPermissions: [FLAGS.KICK_MEMBERS],

    run(msg, args) {
        const { channel, guild, author, mentions } = msg 
        
        const reasonArg = [...args].slice(1).join(" ")
        const userToKick = mentions.users.first()

        if (!userToKick) {
            return msg.reply("musisz podać poprawną nazwe użytkownika do wyrzucenia.")  
        }

        if (userToKick.id === author.id) {
            return msg.reply("nie możesz wyrzucic samego siebie!")
        }

        const memberToKick = guild.members.cache.get(userToKick.id)

        if (!memberToKick.kickable) {
            return channel.send("potrzebuje więcej uprawnień aby wykonać tą komende.")
        }
        memberToKick.kick(reasonArg).then((kickedUser) => {


        const commandName = "Wyrzucono użytkownika"
        const description = `Użytkownik **${kickedUser.user.username}#${kickedUser.user.discriminator}** został wyrzucony.${reasonArg ? `\nPowód: ${reasonArg}` : ""}`

        const embed = new MessageEmbed()
        .setTitle(commandName)
        .setColor(0xfcba03)
        .setDescription(description)
        .addField("Kto wyrzucił", msg.author.tag)
        .setTimestamp()

            channel.send(embed)
        })




    }
}