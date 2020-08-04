const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
  name: "userinfo",
  description: "Pokazuje informacje o użytkowniku.",
  args: true,
  usage: "<użytkownik>",
  cooldown: 10,


  
  async run(msg, bot, args, member) {
      const { channel, client: { axios } } = msg 
      let user = msg.mentions.users.first() || msg.author;
      moment.locale("pl")
      const joinDiscord = moment(user.createdAt).format('L')
      const joinServer = moment(user.joinedAt).format('L')
     

      const status = {
        online: "Online :green_circle: ",
        idle: "Zaraz Wracam :orange_circle: ",
        dnd: "Nie przeszkadzać :red_circle: ",
        offline: "Niedostępny  :black_circle: ",
        streaming: "Na Żywo"
      }
      const getPresenceStatus = status => {
        let presence = ''
     
        switch(Object.keys(status)[0]) {
            case 'desktop': 
              presence = ':desktop: ';
              break;
            case 'mobile':
              presence = ':iphone: ';
            case 'web':
              presence = ':globe_with_meridians: ';
              break;
        }
       return presence
     }
     



      const embed = new MessageEmbed()
          .setTitle(user.username + '#' + user.discriminator)
          .setDescription("Informacje dotyczące użytkownika.")
          .setColor(0xfcba03)
          .setThumbnail(user.displayAvatarURL())
          .addField("Konto utworzone dnia", `${moment.utc(user.createdAt).format("L")} o godzinie ${moment.utc(user.createdAt).format("LT")}`) 
          .addField('Dołączył do serwera', `${moment.utc(user.joinedAt).format("L")} o godzinie ${moment.utc(user.joinedAt).format("LT")}`)
          .addField('Status', `${status[user.presence.status]}`, true)
          .addField('Bot', user.bot ? '🤖 Tak' : '👤 Nie', true)
          .addField('ID', `${user.id}`, true)
          .setTimestamp()
          if (user.presence.clientStatus)
          embed.addField("Platforma", getPresenceStatus(user.presence.clientStatus), true)




          
  
      msg.channel.send(embed);
      return;
  }
}
