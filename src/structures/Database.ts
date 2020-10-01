'use strict'

import mongoose from 'mongoose'
import { Case, CaseDocument } from '../models/CaseModel'
import { Nickname } from '../models/NicknameModel'
import { Mod } from '../models/ModModel'

class CasesDatabase {
  async get(
    guildID: string,
    caseNumber?: number,
    userID?: string
  ): Promise<CaseDocument | CaseDocument[]> {
    if (caseNumber) {
      const searchDB = await Case.findOne({
        guildID: guildID,
        caseID: caseNumber
      })
      return searchDB || undefined
    } else if (userID) {
      const searchDB = await Case.find({
        guildID: guildID,
        userID: userID
      })
      return searchDB || undefined
    } else {
      const searchDB = await Case.find({
        guildID: guildID
      })
      return searchDB
    }
  }

  async create(
    guildID: string,
    type: string,
    userID: string,
    moderatorID: string,
    reason: string,
    date: Date,
    status: string,
    duration?: Date
  ) {
    try {
      const searchDB = await Case.find({
        guildID: guildID
      })
      if (!searchDB || searchDB.length <= 0) {
        const commitDB = await Case.create({
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
          const commitDB = await Case.create({
            guildID: guildID,
            caseID: num,
            userID: userID,
            moderatorID: moderatorID,
            reason: reason,
            date: date,
            status: status,
            type: type,
            duration: duration || null
          }).catch((e) => console.log(e))
          if (!commitDB) return undefined
          return num
        } else {
          return undefined
        }
      }
    } catch (error) {
      console.log(error)
      return
    }
  }

  async edit(
    guildID: string,
    caseNum: number,
    reason: string,
    status: string = 'active',
    newReason: boolean = false
  ) {
    if (!newReason) {
      const updateCase = await Case.updateOne(
        {
          guildID: guildID,
          caseID: caseNum
        },
        {
          status: status,
          reason: reason
        }
      )
      if (!updateCase) return undefined
    } else {
      const updateCase = await Case.updateOne(
        {
          guildID: guildID,
          caseID: caseNum
        },
        {
          status: status,
          newReason: reason
        }
      )
      if (!updateCase) return undefined
    }
    return caseNum
  }

  async delete(guildID: string, caseNum: number) {
    const commitDB = await Case.deleteOne({
      guildID: guildID,
      caseID: caseNum
    })
    if (!commitDB) return undefined
    return caseNum
  }
}

class NicknameDatabase {
  async get(guildID: string, msgID: string) {
    if (!guildID) return undefined
    const searchDB = await Nickname.findOne({
      guildID: guildID,
      msgID: msgID
    })
    return searchDB || undefined
  }

  async create(
    guildID: string,
    msgID: string,
    userID: string,
    nickname: string
  ) {
    if (!guildID || !msgID || !userID || !nickname) return undefined
    const commitDB = await Nickname.create({
      guildID: guildID,
      msgID: msgID,
      userID: userID,
      nickname: nickname
    })
    if (!commitDB) return
    return commitDB
  }

  async delete(guildID: string, msgID: string) {
    if (!guildID || !msgID) return undefined
    const commitDB = await Nickname.deleteOne({
      guildID: guildID,
      msgID: msgID
    })
    return commitDB || undefined
  }
}

class ModDatabase {
  async get(guildID: string, userID: string) {
    if (!guildID) return undefined
    const searchDB = await Mod.findOne({
      guildID: guildID,
      moderatorID: userID
    })
    return searchDB || undefined
  }

  async add(guildID: string, userID: string) {
    if (!guildID || !userID) return undefined
    const commitDB = await Mod.create({
      guildID: guildID,
      moderatorID: userID
    })
    if (!commitDB) return
    return commitDB
  }

  async remove(guildID: string, userID: string) {
    if (!guildID || !userID) return undefined
    const commitDB = await Mod.deleteOne({
      guildID: guildID,
      moderatorID: userID
    })
    return commitDB || undefined
  }
}

export { CasesDatabase, NicknameDatabase, ModDatabase }
