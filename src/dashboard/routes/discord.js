const express = require('express')
const passport = require('passport')
const router = express.Router()

const discordController = require('../controllers/discordController')

router.get('/login', discordController.login, passport.authenticate('discord'))

router.get('/callback', passport.authenticate('discord', { failureRedirect: '/404' }), discordController.callback)

router.get('/logout', discordController.logout)

module.exports = router
