const { MessageEmbed } = require("discord.js")
const { ucfirst } = require("js-helpers")


module.exports = {
    name: "korona",
    description: "Pokazuje informacje o śmierciach, zarażonych i wyleczonych osobach",
    aliases: ["wirus", "corona"],
    args: true,
    usage: "<kraj|all>",
    cooldown: 10,

    async run(msg, args) {
        const { channel, client: { axios } } = msg 


        const arg = args[0]

        const title = "COVID-19"

        const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(0xfcba03)


        if (arg === "all") {
            const data = await axios.get("all").then(({data}) => data)
             
            const { cases, deaths, recovered } = data

            embed.setDescription("Globalne statystyki COVID-19 🌎")
            embed.addField(":thermometer_face: Przypadki", cases.toLocaleString("pl-PL"), true)
            embed.addField(":green_heart: Wyleczeni", recovered.toLocaleString("pl-PL"), true)
            
            embed.addField(":skull_crossbones: Śmierci", deaths.toLocaleString("pl-PL"), true)
            embed.add

            return channel.send(embed)
        }

        const data = await axios.get("countries").then(({data}) => data)

        const countryName = ucfirst(arg.toLowerCase())

        const country = data.filter((x) => x.country === countryName)

        if (!country.length) {
            return msg.reply (`nie znaleziono kraju \`${countryName}\.`)
        }
        
        const { cases, deaths, recovered } = country[0]

        embed.setDescription(`Statystyki COVID-19 dla kraju \`${country[0].country}\`.`)
        embed.addField(":thermometer_face: Przypadki", cases.toLocaleString("pl-PL"), true)
        embed.addField(":green_heart: Wyleczeni", recovered.toLocaleString("pl-PL"), true)
        
        embed.addField(":skull_crossbones: Śmierci", deaths.toLocaleString("pl-PL"), true)
        embed.add

       channel.send(embed)
        
    }
}
