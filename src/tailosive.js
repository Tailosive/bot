require('dotenv').config()

const { QuartzClient } = require('quartz')
const { Client } = require('eris')
const mongoose = require('mongoose')
const config = require('./config')
const path = require('path')
const Functions = require('./structures/TailosiveFunctions')
const Database = require('./structures/TailosiveDatabase')

mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => console.log(error))

const eris = new Client(process.env.TOKEN, {
  disableEvents: {
    TYPING_START: true,
    USER_NOTE_UPDATE: true,
    RELATIONSHIP_ADD: true,
    RELATIONSHIP_REMOVE: true
  },
  messageLimit: 5
})

eris.functions = new Functions(eris)
eris.config = config
eris.invites = []
eris.cases = new Database.CasesDatabase()
eris.nicknames = new Database.NicknameDatabase()
eris.mods = new Database.ModDatabase()

const client = new QuartzClient({
  owner: config.owner,
  eventHandler: {
    directory: path.resolve('./src/events')
  },
  commandHandler: {
    directory: path.resolve('./src/commands'),
    prefix: config.prefix,
    color: config.embed.color,
    text: config.embed.text,
    logo: config.embed.icon
  }
}, eris)

client.start()

require('./dashboard/index')(eris)
