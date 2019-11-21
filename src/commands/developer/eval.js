'use strict'

const { Command } = require('quartz')

const clean = (text) => {
  if (typeof (text) === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
  else return text
}

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      ownerOnly: true
    })
  }

  async run (msg, args) {
    if (msg.author.id !== '392347814413467655') return
    try {
      const code = args.join(' ')
      let evaled = eval(code) // eslint-disable-line
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
      msg.embed(`\`\`\`xl${clean(evaled)}\`\`\``)
    } catch (err) {
      msg.embed(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
    }
  }
}

module.exports = Eval
