import { TailosiveClient } from '../../@types/tailosive'
import { Command, CommandContext, Embed } from '@points.city/quartz'
import { Message } from 'eris'

class Mutes extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'mutes',
      description: {
        content: 'Server or user mutes',
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
        let mutes = await this.client.cases.get(context.message.guildID)
        if (!Array.isArray(mutes))
          return context.message.channel.createMessage({
            embed: { description: ', invalid request.' }
          })
        if (mutes && mutes.length > 0)
          mutes = await mutes.filter(
            (c) => c.type === 'mute' && c.status === 'active'
          )
        if (!mutes || mutes.length <= 0) {
          await context.message.delete('Tailosive Moderation')
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! 0 active mutes in the server!`
            }
          })
        }
        mutes.length = 19
        mutes.sort((a, b) => +b.caseID - +a.caseID)
        const embed = new Embed()
          .setColor(this.client.config.embed.color)
          .setFooter(
            this.client.config.embed.text,
            this.client.config.embed.icon
          )
        embed.setTitle('**Mutes**')
        for (const c of mutes) {
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
        let mutes = await this.client.cases.get(
          context.message.guildID,
          null,
          member.id
        )
        if (!Array.isArray(mutes))
          return context.message.channel.createMessage({
            embed: { description: ', invalid request.' }
          })
        if (mutes && mutes.length > 0)
          mutes = await mutes.filter(
            (c) => c.type === 'mute' && c.status === 'active'
          )
        if (!mutes || mutes.length <= 0) {
          await context.message.delete()
          return context.message.channel.createMessage({
            embed: {
              description: `${context.message.author.mention}, I am surprised! ${member.mention} has 0 mutes!`
            }
          })
        }
        mutes.sort((a, b) => +b.caseID - +a.caseID)
        mutes.length = 19
        const embed = new Embed()
          .setTitle('**Warnings**')
          .setDescription(`${member.user.mention}`)
          .setColor(this.client.config.embed.color)
          .setFooter(
            this.client.config.embed.text,
            this.client.config.embed.icon
          )

        for (const c of mutes) {
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

export default Mutes
