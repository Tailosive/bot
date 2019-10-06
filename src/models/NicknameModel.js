const { Schema } = require('mongoose')

const nicknameSchema = new Schema({
  guildID: { type: String, required: true },
  msgID: { type: String, required: true },
  userID: { type: String, required: true },
  nickname: { type: String }
})

nicknameSchema.index({
  guildID: 1,
  msgID: 1
})

module.exports = nicknameSchema
