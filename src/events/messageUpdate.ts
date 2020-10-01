import { Event, Embed } from '@points.city/quartz'
import { Message, OldMessage } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class MessageUpdateListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'messageUpdate'
    })
  }

  async run(msg: Message, oldMsg: OldMessage) {
    if (
      msg.author.id === this.client.user.id ||
      msg.author.bot ||
      msg.channel.type !== 0
    )
      return
    if (oldMsg.content.startsWith('!')) return
    if (oldMsg.content.length > 1000 || msg.content.length > 1000) return
    const embed = new Embed()
      .setTitle('**Message Updated**')
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
      .addField('Before', `\`\`\`${oldMsg.content}\`\`\``)
      .addField('After', `\`\`\`${msg.content}\`\`\``)
      .setColor(0xffffff)
      .setTimestamp()
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

export default MessageUpdateListener
