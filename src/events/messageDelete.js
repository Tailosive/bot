'use strict'

const { Event } = require('quartz')

class MessageDeleteListener extends Event {
  constructor (client) {
    super(client, {
      name: 'messageDelete'
    })
  }

  async run (msg) {
    if (!msg.author || msg.author.id === this.client.user.id || msg.author.bot) return
    if (msg.content.startsWith('!')) return
    if (msg.content.length > 1000) return
    const embed = this.client.embed()
      .title('**Message Deleted**')
      .field('Member', `${msg.author.mention} (\`${msg.author.username}#${msg.author.discriminator}\`)`, true)
      .field('Channel', `${msg.channel.mention} (\`${msg.channel.name}\`)`, true)
      .field('Content', `\`\`\`${msg.content}\`\`\``)
      .timestamp()
      .color(0xF42202)
    return this.client.createMessage(this.client.config.channels.message_channel, { embed: embed })
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = MessageDeleteListener
