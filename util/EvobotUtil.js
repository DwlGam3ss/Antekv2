module.exports = {
  canModifyQueue(member) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
      member.send("Musisz najpierw dołaczyć do kanału glosowego!").catch(console.error);
      return false;
    }

    return true;
  }
};
