'use strict'

const { Command } = require('quartz')

class CaseCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'cases'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  async run (msg, args) {
    try {
      const member = args[0] && this.client.functions.getUserFromMention(args[0]) ? msg.guild.members.get(this.client.functions.getUserFromMention(args[0]).id) : undefined
      if (!member) {
        const cases = await this.client.cases.get(msg.guild.id)
        if (!cases || cases <= 0) {
          msg.delete()
          return msg.embed(`${msg.author.mention}, I am surprised! 0 mutes in the server!`)
        }
        cases.sort((a, b) => +b.caseID - +a.caseID)
        cases.length = 19
        const embed = this.client.embed()
          .color(this.client.config.embed.color)
          .footer(this.client.config.embed.text, this.client.config.embed.icon)
        embed.title('**Cases**')
        for (const c of cases) {
          if (c) {
            const user = this.client.users.get(c.userID)
            const mod = this.client.users.get(c.moderatorID)
            if (user && mod) embed.field(`#${c.caseID} | **${this.client.functions.escapeRegex(user.username)}#${user.discriminator}**`, `**Reason:** \`${c.reason}\`\n**Moderator:** ${mod.mention} (\`${mod.username}#${mod.discriminator}\`)`)
          }
        }
        return msg.channel.createMessage({ embed: embed })
      } else {
        const cases = await this.client.cases.get(msg.guild.id)
        if (!cases || cases <= 0) {
          msg.delete()
          return msg.embed(`${msg.author.mention}, I am surprised! ${member.mention} has 0 cases`)
        }
        cases.sort((a, b) => +b.caseID - +a.caseID)
        cases.length = 19
        const embed = this.client.embed()
          .color(this.client.config.embed.color)
          .footer(this.client.config.embed.text, this.client.config.embed.icon)
        embed.title('**Cases**')
        embed.description(`${member.user.mention}`)
        for (const c of cases) {
          if (c) {
            const mod = this.client.users.get(c.moderatorID)
            if (mod) embed.field(`Case #${c.caseID}`, `**Reason:** \`${c.reason}\`\n**Moderator:** ${mod.mention} (\`${mod.username}#${mod.discriminator}\`)`)
          }
        }
        embed.field('Full List', '[You can checkout the full list here](https://mods.tailosive.net/cases)')
        return msg.channel.createMessage({ embed: embed })
      }
    } catch (error) {
      console.log(error)
      return msg.embed(`Beep Boop. A error has happened!\n\`\`\`${error.message}\`\`\``)
    }
  }
}

module.exports = CaseCommand
