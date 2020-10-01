import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class ServerOpen8206 extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'serveropen8206',
      description: {
        content: 'Not the server entry command'
      }
    })
  }

  async run(context: CommandContext) {
    try {
      if (
        context.message.channel.id !== '702261737159655535' ||
        context.message.channel.type !== 0
      )
        return
      await context.message.addReaction('✅')
      await context.message.channel.purge(-1)
      await context.message.member.removeRole(
        this.client.config.roles.entry_role
      )
      const embed = new Embed()
        .setTitle('**New Entry**')
        .addField(
          'Member',
          `${context.message.author.mention} \`${context.message.author.username}#${context.message.author.discriminator}\``,
          true
        )
        .setTimestamp(new Date())
        .setColor(this.client.config.embed.color)
        .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
      return this.client.createMessage(
        this.client.config.channels.entry_channel,
        { embed: embed }
      )
    } catch (error) {
      return context.message.channel.createMessage({
        embed: {
          description: `Unable to verify you! Please contact **\\_Adam\\_#2917!**\n\n**Error:**\n\`\`\`${error}\`\`\``
        }
      })
    }
  }
}
export default ServerOpen8206
