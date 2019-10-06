const { Command } = require('quartz')

class Help extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      description: {
        content: 'Get a list of commands along with the correct syntax for each.',
        usage: '[command]',
        examples: ['', 'ban', 'mute']
      }
    })
  }

  async handleArgs (args) {
    if (!args || args.length <= 0 || args.length > 1) return undefined
    const combine = args.join(' ')
    const command = this.client.commandHandler.getCommand(combine.toLowerCase())
    if (!command) return undefined
    return command
  }

  async commandList (msg) {
    const system = await this.client.commandHandler.getCommands('system')
    const other = await this.client.commandHandler.getCommands('other')
    const moderation = await this.client.commandHandler.getCommands('moderation')
    const information = await this.client.commandHandler.getCommands('information')
    const developer = await this.client.commandHandler.getCommands('developer')
    const cases = await this.client.commandHandler.getCommands('cases')
    const embed = this.client.embed()
      .title('**Commands**')
      .field('Cases', cases.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .field('Developer', developer.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .field('Information', information.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .field('Moderation', moderation.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .field('Other', other.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .field('System', system.map(cmd => `\`${msg.prefix}${cmd.name}\``).join(', '))
      .color(await msg.color())
      .footer(await msg.text(), await msg.logo())
    return msg.channel.createMessage({ embed: embed })
  }

  async commandInfo (msg, command) {
    const description = Object.assign({
      content: 'No description available.',
      usage: '',
      examples: [],
      fields: []
    }, command.description)
    const embed = this.client.embed()
      .color(await msg.color())
      .footer(await msg.text(), await msg.logo())
      .title(`**Command: \`${command.name}\`**`)
      .description(description.content)
    if (description.usage) {
      embed.field('Usage', `\`${msg.prefix}${command.name} ${description.usage}\``)
    }
    if (description.examples.length) {
      const text = `${msg.prefix}${command.name}`
      const examples = description.examples.map(example => example.replace('[MENTION]', msg.author.mention))
      embed.field('Examples', `${text} ${examples.join(`\n${text} `)}`, true)
    }
    if (command.aliases.length > 1) {
      embed.field('Aliases', `\`${command.aliases.join('` `')}\``, true)
    }
    return msg.channel.createMessage({ embed: embed })
  }

  async run (msg, args) {
    const command = await this.handleArgs(args)
    if (!command) return this.commandList(msg)
    else return this.commandInfo(msg, command)
  }
}
module.exports = Help
