const {Discord, MessageEmbed} = require("discord.js")


const gif = 'https://discordemoji.com/assets/emoji/wavegif_1860.gif'
const link = 'https://discord.com/api/oauth2/authorize?client_id=739828788120125541&permissions=8&scope=bot'
const embed = new MessageEmbed()
.setTitle("Zaproś mnie na swój serwer Discord! Kliknij tutaj!")
.setColor(0xfcba03)
.setURL(link)
.setThumbnail(gif)

module.exports = {
    name: "zapros",
    description: "Zapros mnie na swojego Discorda!",

     run(message) {
     message.channel.send(embed)
   }
}