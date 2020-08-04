const { MessageEmbed } = require("discord.js");
const moment = require('moment');

module.exports = {
  name: "serverinfo",
  description: "Pokazuje informacje o serwerze.",
  cooldown: 10,


  
  async run(msg, bot, args, member) {
      const { channel, client: { axios } } = msg 
      let user = msg.mentions.users.first() || msg.author;
      moment.locale("pl")
      const joinDiscord = moment(user.createdAt).format('L')
      const joinServer = moment(user.joinedAt).format('L')
      const members = msg.guild.members.cache;
     

      const regions = {
        brazil: 'Brazylia',
        europe: 'Europa',
        hongkong: 'Hong Kong',
        india: 'Indie',
        japan: 'Japonia',
        russia: 'Rosja',
        singapore: 'Singapur',
        southafrica: 'Republika Południowej Afryki',
        sydeny: 'Sydeny',
        'us-central': 'US Central',
        'us-east': 'US East',
        'us-west': 'US West',
        'us-south': 'US South'
    }
    const verificationLevels = {
        NONE: 'Brak',
        LOW: 'Niska',
        MEDIUM: 'Średnia',
        HIGH: 'Wysoka',
        VERY_HIGH: 'Zajebista'
    }

      const embed = new MessageEmbed()
          .setTitle(msg.guild.name)
          .setColor(0xfcba03)
          .setThumbnail(msg.guild.iconURL({ dynamic: true }))
          .addField('Data utworzenia', `${moment(msg.guild.createdTimestamp).format('LT')}, ${moment(msg.guild.createdTimestamp).format('L')}`, true) 
          .addField('Ilość członków', `${msg.guild.memberCount}`, true)
          .addField('Właściciel', `${msg.guild.owner.user.tag}`,  )
          .addField('Region', `${regions[msg.guild.region]}`, true)
          .addField('Użytkownicy', `${members.filter(member => !member.user.bot).size}`, true)
          .addField('ID serwera', (msg.guild.id),  )
          .addField('Boost serwera', `${msg.guild.premiumTier ? `Poziom ${msg.guild.premiumTier}` : 'Brak'}`, true)
          .addField('Boty',`${members.filter(member => member.user.bot).size}`, true)
          .addField('Weryfikacja', `${verificationLevels[msg.guild.verificationLevel]}`, )      
          .setTimestamp()





          
  
      msg.channel.send(embed);
      return;
  }
}