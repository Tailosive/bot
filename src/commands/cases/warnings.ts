import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'
import { TailosiveClient } from '../../@types/tailosive'

class Warnings extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'warnings',
      description: {
        content: 'Server or user warnings',
        usage: '[user]'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    try {
      const member =
        context.arguments[0] &&
        this.client.functions.getUserFromMention(context.arguments[0])
          ? context.message.member.guild.members.get(
              this.client.functions.getUserFromMention(context.arguments[0]).id
            )
          : undefined
      if (!member) {
        let warnings = await this.client.cases.get(context.message.guildID)
        if (!Array.isArray(warnings))
          return context.message.channel.createMessage({
            embed: { description: ', invalid request.' }
          })
        if (warnings && warnings.length > 0)
          warnings = await warnings.filter((c) => c.type === 'warn')
        if (!warnings || warnings.length <= 0) {
          await context.message.delete()
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! 0 warnings in the server!`
            }
          })
        }
        warnings.sort((a, b) => +b.caseID - +a.caseID)
        warnings.length = 19
        const embed = new Embed()
          .setColor(this.client.config.embed.color)
          .setFooter(
            this.client.config.embed.text,
            this.client.config.embed.icon
          )
        embed.setTitle('**Warnings**')
        for (const c of warnings) {
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
        embed.addField(
          'Full List',
          'Not Implemented. Contact dev for full list.',
          false
        )
        return context.message.channel.createMessage({ embed: embed })
      } else {
        let warnings = await this.client.cases.get(
          context.message.guildID,
          null,
          member.id
        )
        if (!Array.isArray(warnings))
          return context.message.channel.createMessage({
            embed: { description: ', invalid request.' }
          })
        if (warnings && warnings.length > 0)
          warnings = await warnings.filter((c) => c.type === 'warn')
        if (!warnings || warnings.length <= 0) {
          await context.message.delete()
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! ${member.mention} has 0 warnings!`
            }
          })
        }
        warnings.sort((a, b) => +b.caseID - +a.caseID)
        warnings.length = 19
        const embed = new Embed()
          .setColor(this.client.config?.embed.color)
          .setFooter(
            this.client.config?.embed.text,
            this.client.config?.embed.icon
          )
        embed.setTitle('**Warnings**')
        embed.setDescription(`${member.user.mention}`)
        for (const c of warnings) {
          if (c) {
            const mod = this.client.users.get(c.moderatorID)
            if (mod)
              embed.addField(
                `Case #${c.caseID}`,
                `**Reason:** \`${c.reason}\`\n**Moderator:** ${mod.mention} (\`${mod.username}#${mod.discriminator}\`)`,
                false
              )
          }
        }
        embed.addField(
          'Full List',
          'Not Implemented. Contact dev for full list.',
          false
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

export default Warnings
