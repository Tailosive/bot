const { Command } = require('quartz')

class Nickname extends Command {
  constructor (client) {
    super(client, {
      name: 'nickname',
      aliases: ['nick']
    })
  }

  async run (msg, args) {
    await msg.delete('Tailosive Moderation')
    if (!this.client.functions.moderator(msg) && !process.env.NODE_ENV !== 'development') return msg.embed(`${msg.author.mention}, Can't set moderator nickname.`)
    if (!args || args.join(' ').length < 1) return msg.embed(`${msg.author.mention}, A nickname is required to process the request.`)
    if (args.join(' ').toLowerCase() === 'reset') {
      await this.client.editNickname(msg.guild.id, msg.author.username, 'Nickname Reset')
      const embed = this.client.embed()
        .title('**Nickname Reset**')
        .field('Member', `${msg.author.mention} \`${msg.author.username}#${msg.author.discriminator}\``, true)
        .field('Nickname', `\`${msg.author.username}\``)
        .thumbnail(msg.author.avatarURL || msg.author.defaultAvatarURL)
        .timestamp(new Date())
        .color(0xFF00FF)
        .footer(`ID: ${msg.author.id} | ${await msg.text()}`, await msg.logo())
      await this.client.createMessage(this.client.config.channels.nickname_channel, { embed: embed })
      return msg.embed(`${msg.author.mention}, Your nickname has been reset.`)
    }
    if (args.join(' ').length > 32) return msg.embed(`${msg.author.mention}, The nickname is too long. Please keep it under 32-characters.`)
    const embed = this.client.embed()
      .title('**Nickname Request**')
      .field('Member', `${msg.author.mention} \`${msg.author.username}#${msg.author.discriminator}\``, true)
      .field('Nickname', `\`${args.join(' ')}\``)
      .thumbnail(msg.author.avatarURL || msg.author.defaultAvatarURL)
      .timestamp(new Date())
      .color(0x47ff47)
      .footer(`ID: ${msg.author.id} | ${await msg.text()}`, await msg.logo())
    const message = await this.client.createMessage(this.client.config.channels.nickname_channel, { embed: embed })
    await message.addReaction('✅')
    await message.addReaction('❌')
    const send = await this.client.nicknames.create(msg.guild.id, message.id, msg.author.id, args.join(' '))
    if (!send) {
      message.delete('Tailosive Moderation')
      return msg.embed('Unable to handle request....')
    }
    return msg.embed(`${msg.author.mention}, Submitted nickname: \`${args.join(' ')}\``)
  }
}

module.exports = Nickname
