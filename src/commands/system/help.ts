import { Command, CommandContext, Embed } from '@points.city/quartz'
import { TailosiveClient } from '../../@types/tailosive'

class Help extends Command {
  client: TailosiveClient

  constructor(client: TailosiveClient) {
    super(client, {
      name: 'help',
      description: {
        content:
          'Get a list of commands along with the correct syntax for each.',
        usage: '[command]',
        examples: ['', 'ban', 'mute']
      }
    })
  }

  async handleArgs(args: string[]) {
    if (!args || args.length <= 0 || args.length > 1) return undefined
    const combine = args.join(' ')
    const command = this.client.commandHandler.getCommand(combine.toLowerCase())
    if (!command) return undefined
    return command
  }

  async commandList(context: CommandContext) {
    const system = await this.client.commandHandler.getCommands('system')
    const other = await this.client.commandHandler.getCommands('other')
    const moderation = await this.client.commandHandler.getCommands(
      'moderation'
    )
    const information = await this.client.commandHandler.getCommands(
      'information'
    )
    const developer = await this.client.commandHandler.getCommands('developer')
    const cases = await this.client.commandHandler.getCommands('cases')
    const embed = new Embed()
      .setTitle('**Commands**')
      .addField(
        'Cases',
        cases.map((cmd: any) => `\`${context.prefix}${cmd.name}\``).join(', ')
      )
      .addField(
        'Developer',
        developer
          .map((cmd: any) => `\`${context.prefix}${cmd.name}\``)
          .join(', ')
      )
      .addField(
        'Information',
        information
          .map((cmd: any) => `\`${context.prefix}${cmd.name}\``)
          .join(', ')
      )
      .addField(
        'Moderation',
        moderation
          .map((cmd: any) => `\`${context.prefix}${cmd.name}\``)
          .join(', ')
      )
      .addField(
        'Other',
        other.map((cmd: any) => `\`${context.prefix}${cmd.name}\``).join(', ')
      )
      .addField(
        'System',
        system.map((cmd: any) => `\`${context.prefix}${cmd.name}\``).join(', ')
      )
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    return context.message.channel.createMessage({ embed: embed })
  }

  async commandInfo(context: CommandContext, command: any) {
    const description = Object.assign(
      {
        content: 'No description available.',
        usage: '',
        examples: [],
        fields: []
      },
      command.description
    )
    const embed = new Embed()
      .setTitle(`**Command: \`${command.name}\`**`)
      .setDescription(description.content)
      .setColor(this.client.config.embed.color)
      .setFooter(this.client.config.embed.text, this.client.config.embed.icon)
    if (description.usage) {
      embed.addField(
        'Usage',
        `\`${context.prefix}${command.name} ${description.usage}\``
      )
    }
    if (description.examples.length) {
      const text = `${context.prefix}${command.name}`
      const examples = description.examples.map((example: any) =>
        example.replace('[MENTION]', context.message.author.mention)
      )
      embed.addField('Examples', `${text} ${examples.join(`\n${text} `)}`, true)
    }
    if (command.aliases.length > 1) {
      embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true)
    }
    return context.message.channel.createMessage({ embed: embed })
  }

  async run(context: CommandContext) {
    const command = await this.handleArgs(context.arguments)
    if (!command) return this.commandList(context)
    else return this.commandInfo(context, command)
  }
}

export default Help
