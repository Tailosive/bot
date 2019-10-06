'use strict'

const mongoose = require('mongoose')
const CaseModel = require('../models/CaseModel')
const NicknameModel = require('../models/NicknameModel')

class CasesDatabase {
  constructor () {
    this.cases = mongoose.model('cases', CaseModel)
  }

  async get (guildID, caseNumber, userID = null) {
    if (caseNumber) {
      const searchDB = await this.cases.findOne({
        guildID: guildID,
        caseID: caseNumber
      })
      return searchDB || undefined
    } else if (userID) {
      const searchDB = await this.cases.find({
        guildID: guildID,
        userID: userID
      })
      return searchDB || undefined
    } else {
      const searchDB = await this.cases.find({
        guildID: guildID
      })
      return searchDB
    }
  }

  async create (guildID, type, userID, moderatorID, reason, date, status, duration) {
    const searchDB = await this.cases.find({
      guildID: guildID
    })
    if (!searchDB || searchDB.length <= 0) { // eslint-disable-line
      const commitDB = await this.cases.create({
        guildID: guildID,
        caseID: 1,
        userID: userID,
        moderatorID: moderatorID,
        reason: reason,
        date: date,
        status: status,
        type: type,
        duration: duration || null
      })
      console.log(searchDB)
      if (!commitDB) return undefined
      return 1
    } else {
      let num = 0
      const sortNum = []
      for (const caseObject of searchDB) {
        if (!isNaN(caseObject.caseID)) sortNum.push(caseObject.caseID)
      }
      const largest = Math.max(...sortNum)
      num = largest + 1
      if (num > largest) {
        const commitDB = await this.cases.create({
          guildID: guildID,
          caseID: num,
          userID: userID,
          moderatorID: moderatorID,
          reason: reason,
          date: date,
          status: status,
          type: type,
          duration: duration || null
        })
        if (!commitDB) return undefined
        return num
      } else {
        return undefined
      }
    }
  }

  async edit (guildID, caseNum, reason, status = 'active', newReason = false) {
    if (!newReason) {
      const updateCase = await this.cases.findOneAndUpdate({
        guildID: guildID,
        caseID: caseNum
      }, {
        status: status,
        reason: reason
      })
      if (!updateCase) return undefined
    } else {
      const updateCase = await this.cases.findOneAndUpdate({
        guildID: guildID,
        caseID: caseNum
      }, {
        status: status,
        newReason: reason
      })
      if (!updateCase) return undefined
    }
    return caseNum
  }

  async delete (guildID, caseNum) {
    const commitDB = await this.cases.findOneAndDelete({
      guildID: guildID,
      caseID: caseNum
    })
    if (!commitDB) return undefined
    return caseNum
  }
}

class NicknameDatabase {
  constructor () {
    this.nicknames = mongoose.model('nicknames', NicknameModel)
  }

  async get (guildID, msgID) {
    if (!guildID) return undefined
    const searchDB = await this.nicknames.findOne({
      guildID: guildID,
      msgID: msgID
    })
    return searchDB || undefined
  }

  async create (guildID, msgID, userID, nickname) {
    if (!guildID || !msgID || !userID || !nickname) return undefined
    const commitDB = await this.nicknames.create({
      guildID: guildID,
      msgID: msgID,
      userID: userID,
      nickname: nickname
    })
    if (!commitDB) return
    return commitDB
  }

  async delete (guildID, msgID) {
    if (!guildID || !msgID) return undefined
    const commitDB = await this.nicknames.findOneAndDelete({
      guildID: guildID,
      msgID: msgID
    })
    return commitDB || undefined
  }
}

module.exports = {
  CasesDatabase,
  NicknameDatabase
}
