const { Command } = require('quartz')

class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      aliases: ['pong'],
      description: {
        content: 'Gets the latency of the bot in milliseconds.'
      }
    })
  }

  async run (msg, args) {
    const pingMessage = await msg.channel.createMessage(`<@${msg.author.id}>, Pong!`)
    const sentTime = pingMessage.editedTimestamp || pingMessage.timestamp
    const startTime = msg.editedTimestamp || msg.timestamp
    const embed = this.client.embed()
      .description(`**Latency: \`${sentTime - startTime}ms\`**`)
      .color(await msg.color())
    return pingMessage.edit({ embed: embed, content: '' })
  }
}
module.exports = Ping
