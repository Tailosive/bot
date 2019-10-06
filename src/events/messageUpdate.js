'use strict'

const { Event } = require('quartz')

class MessageUpdateListener extends Event {
  constructor (client) {
    super(client, {
      name: 'messageUpdate'
    })
  }

  async run (msg, oldMsg) {
    if (msg.author.id === this.client.user.id || msg.author.bot) return
    if (oldMsg.content.startsWith('!')) return
    if (oldMsg.content.length > 1000 || msg.content.length > 1000) return
    const embed = this.client.embed()
      .title('**Message Updated**')
      .field('Member', `${msg.author.mention} (\`${msg.author.username}#${msg.author.discriminator}\`)`, true)
      .field('Channel', `${msg.channel.mention} (\`${msg.channel.name}\`)`, true)
      .field('Before', `\`\`\`${oldMsg.content}\`\`\``)
      .field('After', `\`\`\`${msg.content}\`\`\``)
      .color(0xFFFFFF)
      .timestamp()
    return this.client.createMessage(this.client.config.channels.message_channel, { embed: embed })
  }

  escapeRegex (text) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

module.exports = MessageUpdateListener
