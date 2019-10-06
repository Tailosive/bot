const { Schema } = require('mongoose')

const caseSchema = new Schema({
  guildID: { type: String, required: true },
  caseID: { type: String, required: true },
  userID: { type: String, required: true },
  moderatorID: { type: String, required: true },
  reason: { type: String },
  newReason: { type: String },
  date: { type: Date },
  status: { type: String },
  type: { type: String },
  duration: { type: Date }
})

caseSchema.index({
  guildID: 1,
  caseID: 1
})

module.exports = caseSchema
