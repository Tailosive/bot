import { TailosiveClient } from '../../@types/tailosive'
import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'

class CaseCommand extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'cases',
      description: {
        content: 'Server or user cases',
        usage: '[user]'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    if (context.message.channel.type !== 0) return
    try {
      const member =
        (context.arguments[0] &&
          (await this.client.utils.resolveMember(
            context.message.channel.guild,
            context.arguments[0]
          ))) ||
        undefined
      if (!member) {
        const cases = await this.client.cases.get(context.message.guildID)
        if (!cases || !Array.isArray(cases) || cases.length <= 0) {
          await context.message.delete()
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! 0 cases in the server!`
            }
          })
        }
        cases.sort((a, b) => +b.caseID - +a.caseID)
        cases.length = 19
        const embed = new Embed()
          .setColor(this.client.config.embed.color)
          .setFooter(
            this.client.config.embed.text,
            this.client.config.embed.icon
          )
        embed.setTitle('**Cases**')
        for (const c of cases) {
          if (c) {
            const user = this.client.users.get(c.userID)
            const mod = this.client.users.get(c.moderatorID)
            if (user && mod)
              embed.addField(
                `#${c.caseID} | **${this.client.functions.escapeRegex(
                  user.username
                )}#${user.discriminator}**`,
                `**Reason:** \`${c.reason}\`\n**Moderator:** ${mod.mention} (\`${mod.username}#${mod.discriminator}\`)`,
                false
              )
          }
        }
        return context.message.channel.createMessage({ embed: embed })
      } else {
        const cases = await this.client.cases.get(
          context.message.guildID,
          null,
          member.id
        )
        if (!cases || !Array.isArray(cases) || cases.length <= 0) {
          await context.message.delete()
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! ${member.mention} has 0 cases`
            }
          })
        }
        cases.sort((a, b) => +b.caseID - +a.caseID)
        cases.length = 19
        const embed = new Embed()
          .setColor(this.client.config.embed.color)
          .setFooter(
            this.client.config.embed.text,
            this.client.config.embed.icon
          )
        embed.setTitle('**Cases**')
        embed.setDescription(`${member.user.mention}`)
        for (const c of cases) {
          if (c) {
            const mod = this.client.users.get(c.moderatorID)
            if (mod)
              embed.addField(
                `Case #${c.caseID}`,
                `**Reason:** \`${c.reason}\`\n**Moderator:** ${mod.mention} (\`${mod.username}#${mod.discriminator}\`)`
              )
          }
        }
        embed.addField(
          'Full List',
          '[You can checkout the full list here](https://mods.tailosive.net/cases)'
        )
        return context.message.channel.createMessage({ embed: embed })
      }
    } catch (error) {
      console.log(error)
      return context.message.channel.createMessage({
        embed: {
          description: `Beep Boop. A error has happened!\n\`\`\`${error.message}\`\`\``
        }
      })
    }
  }
}

export default CaseCommand
