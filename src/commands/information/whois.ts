import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'
import moment from 'moment'
import { Message } from 'eris'

class Warn extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'whois',
      description: {
        content: 'Information about a user',
        usage: '[user]'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    const member =
      context.arguments[0] &&
      this.client.functions.getUserFromMention(context.arguments[0])
        ? context.message.member.guild.members.get(
            this.client.functions.getUserFromMention(context.arguments[0]).id
          )
        : context.message.member
    const joinDiscord = moment(member.user.createdAt).format('lll')
    const joinServer = moment(member.joinedAt).format('lll')
    const r = member.roles
      .map((role) => `<@&${role}>`)
      .join(', ')
      .substr(0, 900)
    const bot = member.user.bot
    const whoisEmbed = new Embed()
      .setThumbnail(member.user.avatarURL || member.user.defaultAvatarURL)
      .setAuthor(
        `**${this.escapeRegex(member.user.username)}#${
          member.user.discriminator
        }** ${bot ? '<:bot:557352165686116364>' : ''}`,
        member.user.avatarURL || member.user.defaultAvatarURL
      )
      .addField(
        'Nickname',
        `${this.escapeRegex(member.nick ? member.nick : member.user.username)}`,
        true
      )
      .addField('Status', member.status, true)
      .addField('Joined', joinServer, true)
      .addField('Registered', joinDiscord, true)
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    const cases = await this.client.cases.get(
      context.message.guildID,
      null,
      member.id
    )
    if (!Array.isArray(cases)) return
    if (
      !member.roles.includes(this.client.config.roles.mod_role) &&
      !member.user.bot
    ) {
      whoisEmbed.addField(
        'Warnings',
        cases.filter((c) => c.type === 'warn')
          ? cases.filter((c) => c.type === 'warn').length.toString()
          : 'No warnings',
        true
      )
      whoisEmbed.addField(
        'Total Cases',
        cases.length.toString() || 'No cases',
        true
      )
    }
    let description = member.user.mention
    if (r) whoisEmbed.addField('Roles', r)
    if (member.user.id === '392347814413467655')
      description = 'Dead Deer. Hahahahahahahahahaha' // Adam
    if (member.user.id === '231534805102231552')
      description = '#1 Tailosive Food Fan' // Michael
    if (member.user.id === '346615886603354112')
      description = "I don't know or care" // eslint-disable-line
    if (member.user.id === '198638530371518475')
      description = 'Long time listener, first time caller' // Sam
    whoisEmbed.setDescription(description)

    if (member.clientStatus.desktop)
      whoisEmbed.addField('Game', member.clientStatus.desktop)
    return context.message.channel.createMessage({ embed: whoisEmbed })
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

export default Warn
