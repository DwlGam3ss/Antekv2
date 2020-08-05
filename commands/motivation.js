const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports =  {
      name: 'cytat',
      aliases: ["motivational", "mt"],
      description: 'Uzyskaj losową wycenę motywacyjną',
      cooldown: '5',

  run(message) {

    const jsonQuotes = fs.readFileSync(
      'resources/quotes/motivation.json',
      'utf8'
    );
    const quoteArray = JSON.parse(jsonQuotes).quotes;

    const randomQuote =
      quoteArray[Math.floor(Math.random() * quoteArray.length)];

    const quoteEmbed = new MessageEmbed()
      .setTitle(randomQuote.author)
      .setDescription(randomQuote.text)
      .setColor('0xfcba03');
    return message.channel.send(quoteEmbed);
  }
};