import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Poll extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'poll',
      description: {
        content: 'A command for mods to make polls'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    if (!context.arguments.join())
      return context.message.channel.createMessage({
        embed: { description: 'Please give a question to ask for a poll!' }
      })
    const embed = new Embed()
      .setTitle(
        `Poll by ${this.client.functions.escapeRegex(
          `${context.message.author.username}#${context.message.author.discriminator}`
        )}`
      )
      .setDescription(context.arguments.join(' '))
      .setTimestamp(new Date())
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    const message = await context.message.channel.createMessage({
      embed: embed
    })
    await message.addReaction('✅')
    await message.addReaction('❌')
    return
  }
}

export default Poll
