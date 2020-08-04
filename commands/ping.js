const {Discord, MessageEmbed} = require("discord.js")

const embed = new MessageEmbed()
.setTitle(`Ping?`)
.setColor(0xfcba03)




module.exports = {
    name: "ping",
    description: "Ping!",

    async run( msg, args, channel, member ) {
        const m = await msg.channel.send(embed)
        setInterval(() => {

            const embed1 = new MessageEmbed()
            .setTitle(`Pong!:ping_pong:  ${m.createdTimestamp - msg.createdTimestamp}ms`)
            .setColor(0xfcba03)
            m.edit(embed1)

        }, 1500);
   }
}

