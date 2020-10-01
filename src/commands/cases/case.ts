import { TailosiveClient } from '../../@types/tailosive'
import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'

class Case extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'case',
      description: {
        content: 'Check case information',
        usage: '[case]'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    if (!context.arguments[0] || isNaN(Number(context.arguments[0])))
      return context.message.channel.createMessage({
        embed: {
          description:
            'That is not a valid case. Please give me a valid case number. | **Tailosive Database**'
        }
      })
    const caseObj = await this.client.cases.get(
      context.message.guildID,
      Number(context.arguments[0])
    )
    if (!caseObj || Array.isArray(caseObj))
      return context.message.channel.createMessage({
        embed: { description: 'Unable to find case | **Tailosive Database**' }
      })
    const embed = new Embed()
      .setTitle(`Case #${caseObj.caseID} | **Details**`)
      .addField(
        'Moderator',
        context.message.member.guild.members.get(caseObj.moderatorID)
          .username || caseObj.moderatorID,
        true
      )
      .addField(
        'User',
        context.message.member.guild.members.get(caseObj.userID).username ||
          caseObj.userID,
        true
      )
      .addField('Reason', caseObj.reason, true)
      .addField('Action', caseObj.type, true)
      .setDescription(
        `\`\`\`json\n${JSON.stringify(caseObj, null, '\t')}\`\`\``
      )
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    return context.message.channel.createMessage({ embed: embed })
  }
}

export default Case
