import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'
import moment from 'moment'
import { Message } from 'eris'

class Server extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'server',
      description: {
        content: 'Information about the server'
      }
    })
  }

  async userPermissions(msg: Message) {
    return this.client.functions.moderator(msg)
  }

  async run(context: CommandContext) {
    const created = moment(context.message.member.guild.createdAt).format('lll')
    const roles = context.message.member.guild.roles
      .map((role) => role.mention)
      .join(', ')
      .substr(0, 900)
    const whoisEmbed = new Embed()
      .setTitle(`**${this.escapeRegex(context.message.member.guild.name)}**`)
      .setDescription('This is the official Tailosive discord!')
      .addField('Created', created, true)
      .addField(
        'Members',
        context.message.member.guild.memberCount.toString(),
        true
      )
      .addField(
        'Channels',
        context.message.member.guild.channels.size.toString(),
        true
      )
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    if (roles) whoisEmbed.addField('Roles', roles)
    return context.message.channel.createMessage({ embed: whoisEmbed })
  }

  escapeRegex(text: string) {
    const unescaped = text.replace(/\\(\*|_|`|~|\\)/g, '$1')
    const escaped = unescaped.replace(/(\*|_|`|~|\\)/g, '\\$1')
    return escaped
  }
}

export default Server
