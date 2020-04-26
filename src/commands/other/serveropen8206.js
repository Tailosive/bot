const { Command } = require('quartz')

class ServerOpen8206 extends Command {
  constructor (client) {
    super(client, {
      name: 'serveropen8206'
    })
  }

  async run (msg) {
    try {
      if (msg.channel.id !== '702261737159655535') return
      await msg.addReaction('✅')
      await msg.channel.purge(-1)
      await msg.member.removeRole(this.client.config.roles.entry_role)
      const embed = this.client.embed()
        .title('**New Entry**')
        .field('Member', `${msg.author.mention} \`${msg.author.username}#${msg.author.discriminator}\``, true)
        .timestamp(new Date())
        .color(await msg.color())
        .footer(await msg.text(), await msg.logo())
      return this.client.createMessage(this.client.config.channels.entry_channel, { embed: embed })
    } catch (error) {
      return msg.embed(`Unable to verify you! Please contact **\\_Adam\\_#2917!**\n\n**Error:**\n\`\`\`${error}\`\`\``)
    }
  }
}

module.exports = ServerOpen8206
