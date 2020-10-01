import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Bot extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'bot',
      aliases: ['botinfo'],
      description: {
        content: 'Information about the bot'
      }
    })
  }

  async run(context: CommandContext) {
    const developer = this.client.users.get(this.client.config.owner)
    const embed = new Embed()
      .setTitle(`**${this.client.user.username}**`)
      .addField('Developer', `\`${developer.username}\``, true)
      .addField(
        'Frameworks',
        '↳ Quartz (private)\n↳ [Eris](https://abal.moe/Eris/)',
        true
      )
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    return context.message.channel.createMessage({ embed: embed })
  }
}

export default Bot
