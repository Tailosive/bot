import { Event, Embed } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../@types/tailosive'

class MessageCreateListener extends Event {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'messageCreate'
    })
  }

  async run(msg: Message) {
    if (!msg.author || msg.author.id === this.client.user.id || msg.author.bot)
      return
    if (
      msg.content !== '!serveropen8206' &&
      msg.channel.id === '702261737159655535'
    ) {
      const embed = new Embed()
        .setTitle('**Entry Failed**')
        .addField(
          '**Member**',
          `${msg.author.mention} \`${msg.author.username}#${msg.author.discriminator}\``,
          false
        )
        .addField('**Content**', `\`\`\`${msg.content}\`\`\``)
        .setTimestamp(new Date())
        .setColor(0xff0000)
        .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
      await this.client.createMessage(
        this.client.config.channels.entry_log_channel,
        { embed: embed }
      )
      return msg.delete()
    }
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

export default MessageCreateListener
