const { Schema } = require('mongoose')

const modSchema = new Schema({
  guildID: { type: String, required: true },
  moderatorID: { type: String, required: true }
})

modSchema.index({
  guildID: 1,
  moderatorID: 1
})

module.exports = modSchema
