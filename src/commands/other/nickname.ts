import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Nickname extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'nickname',
      aliases: ['nick'],
      description: {
        content: 'Change nickname for server',
        usage: '(nickname)'
      }
    })
  }

  async run(context: CommandContext) {
    await context.message.delete('Tailosive Moderation')
    if (
      !this.client.functions.moderator(context.message) &&
      process.env.NODE_ENV !== 'development'
    )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Can't set moderator nickname.`
        }
      })
    if (!context.arguments || context.arguments.join(' ').length < 1)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, A nickname is required to process the request.`
        }
      })
    if (context.arguments.join(' ').toLowerCase() === 'reset') {
      await context.message.member.edit(
        { nick: context.message.author.username },
        'Nickname Reset'
      )
      const embed = new Embed()
        .setTitle('**Nickname Reset**')
        .addField(
          'Member',
          `${context.message.author.mention} \`${context.message.author.username}#${context.message.author.discriminator}\``,
          true
        )
        .addField('Nickname', `\`${context.message.author.username}\``)
        .setThumbnail(
          context.message.author.avatarURL ||
            context.message.author.defaultAvatarURL
        )
        .setTimestamp(new Date())
        .setColor(0xff00ff)
        .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
      await this.client.createMessage(
        this.client.config.channels.nickname_channel,
        { embed: embed }
      )
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, Your nickname has been reset.`
        }
      })
    }
    if (context.arguments.join(' ').length > 32)
      return context.message.channel.createMessage({
        embed: {
          description: `${context.message.author.mention}, The nickname is too long. Please keep it under 32-characters.`
        }
      })
    const embed = new Embed()
      .setTitle('**Nickname Request**')
      .addField(
        'Member',
        `${context.message.author.mention} \`${context.message.author.username}#${context.message.author.discriminator}\``,
        true
      )
      .addField('Nickname', `\`${context.arguments.join(' ')}\``)
      .setThumbnail(
        context.message.author.avatarURL ||
          context.message.author.defaultAvatarURL
      )
      .setTimestamp(new Date())
      .setColor(0x47ff47)
      .setFooter(`ID: ${context.message.author.id}`)
    const message = await this.client.createMessage(
      this.client.config.channels.nickname_channel,
      { embed: embed }
    )
    await message.addReaction('✅')
    await message.addReaction('❌')
    const send = await this.client.nicknames.create(
      context.message.guildID,
      message.id,
      context.message.author.id,
      context.arguments.join(' ')
    )
    if (!send) {
      await message.delete('Tailosive Moderation')
      return context.message.channel.createMessage({
        embed: { description: 'Unable to handle request....' }
      })
    }
    return context.message.channel.createMessage({
      embed: {
        description: `${
          context.message.author.mention
        }, Submitted nickname: \`${context.arguments.join(' ')}\``
      }
    })
  }
}

module.exports = Nickname
