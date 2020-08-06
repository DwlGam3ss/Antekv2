const fs = require("fs");
const config = require("../config.json");
const { MessageEmbed } = require("discord.js")

module.exports = {
  name: "pruning",
  description: "Przełącz czyszczenie wiadomości od botów",
  run(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Wystąpił błąd podczas zapisywania do pliku.").catch(console.error);
      }


      const czysc = new MessageEmbed()
      .setTitle("Oczyszczanie wiadomości jest")
      .setDescription(`${config.PRUNING ? "**Włączone**" : "**Wyłączone**"}`)
      .setColor("0xfcba03")

      return message.channel
        .send(czysc)
        .catch(console.error);
    });
  }
};
