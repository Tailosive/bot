import { Event, Embed } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class MessageDeleteListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'messageDelete'
    })
  }

  async run(msg: Message) {
    if (
      !msg.author ||
      msg.author.id === this.client.user.id ||
      msg.author.bot ||
      msg.channel.type !== 0
    )
      return
    if (msg.content.startsWith('!')) return
    if (msg.content.length > 1000) return
    const embed = new Embed()
      .setTitle('**Message Deleted**')
      .addField(
        'Member',
        `${msg.author.mention} (\`${msg.author.username}#${msg.author.discriminator}\`)`,
        true
      )
      .addField(
        'Channel',
        `${msg.channel.mention} (\`${msg.channel.name}\`)`,
        true
      )
      .addField('Content', `\`\`\`${msg.content}\`\`\``)
      .setTimestamp()
      .setColor(0xf42202)
    return this.client.createMessage(
      this.client.config.channels.message_channel,
      { embed: embed }
    )
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

export default MessageDeleteListener
