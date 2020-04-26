'use strict'

const { Event } = require('quartz')

class MessageCreateListener extends Event {
  constructor (client) {
    super(client, {
      name: 'messageCreate'
    })
  }

  async run (msg) {
    if (!msg.author || msg.author.id === this.client.user.id || msg.author.bot) return
    if (msg.content !== '!serveropen8206' && msg.channel.id === '702261737159655535') {
      const embed = this.client.embed()
        .title('**Entry Failed**')
        .field('Member', `${msg.author.mention} \`${msg.author.username}#${msg.author.discriminator}\``, false)
        .field('Content', msg.content)
        .timestamp(new Date())
        .color(0xFF0000)
        .footer(this.client.config.embed.text, this.client.config.embed.icon)
      await this.client.createMessage(this.client.config.channels.entry_channel, { embed: embed })
      return msg.delete()
    }
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = MessageCreateListener
