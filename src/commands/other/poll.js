const { Command } = require('quartz')

class Poll extends Command {
  constructor (client) {
    super(client, {
      name: 'poll'
    })
  }

  userPermissions (msg) {
    return this.client.functions.moderator(msg)
  }

  async run (msg, args) {
    if (!args.join()) return msg.embed('Please give a question to ask for a poll!')
    const embed = this.client.embed()
      .title(`Poll by ${this.client.functions.escapeRegex(`${msg.author.username}#${msg.author.discriminator}`)}`)
      .description(args.join())
      .timestamp(new Date())
      .color(await msg.color())
      .footer(await msg.text(), await msg.logo())
    const message = await msg.channel.createMessage({ embed: embed })
    await message.addReaction('✅')
    await message.addReaction('❌')
  }
}

module.exports = Poll
