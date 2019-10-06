require('dotenv').config()

const path = require('path')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const { Strategy } = require('passport-discord')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const config = require('../config.js')

const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const app = express()
const port = process.env.PORT || 6969
const scopes = ['identify', 'guilds']
const utils = require('./utils')
const discordController = require('./controllers/discordController')

const staticify = require('staticify')(path.join(__dirname, 'public'))

module.exports = (client) => {
  app.use(staticify.middleware)

  app.locals = {
    getVersionedPath: staticify.getVersionedPath
  }

  app.use((req, res, next) => {
    req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2') //eslint-disable-line
    next()
  })
  app.use(express.static(path.join(__dirname, 'public'), { maxAge: '30 days' }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((obj, done) => {
    done(null, obj)
  })

  passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callback: process.env.NODE_ENV !== 'development' ? config.callbackURL : 'http://localhost:6969/discord/callback',
    scope: scopes
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      return done(null, profile)
    })
  }))

  const sessionOption = session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.SERVER_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV !== 'development' ? true : false, maxAge: 6.048e+8 } // eslint-disable-line
  })
  app.use(sessionOption)

  app.use(passport.initialize())
  app.use(passport.session())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  app.engine('html', require('ejs').renderFile)
  app.set('view engine', 'html')

  const discordRoute = require('./routes/discord')
  app.use('/discord', discordRoute)

  app.get('/', (req, res) => {
    return utils.renderTemplate(res, req, 'index.ejs')
  })

  app.get('/cases', discordController.verify, async (req, res) => {
    const cases = await client.cases.get(config.main_guild)
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'Newest':
          cases.sort((a, b) => {
            return b.date - a.date
          })
          break
        case 'Oldest':
          cases.sort((a, b) => {
            return a.date - b.date
          })
          break
      }
    }
    if (req.query.type) {
      switch (req.query.type) {
        case 'All-Cases':
          break
        case 'Warnings':
          cases.filter(c => {
            if (c.type === 'warn') return c
          })
          break
        case 'Mutes':
          cases.filter(c => {
            if (c.type === 'mute') return c
          })
          break
        case 'Kicks':
          cases.filter(c => {
            if (c.type === 'kick') return c
          })
          break
        case 'Bans':
          cases.filter(c => {
            if (c.type === 'ban') return c
          })
          break
      }
    }
    return utils.renderTemplate(res, req, 'cases.ejs', { cases, bot: client })
  })

  app.get('/case/:case', discordController.verify, async (req, res) => {
    if (!req.params.case) return res.redirect('/404')
    const c = await client.cases.get(config.main_guild, req.params.case)
    if (!c) return res.redirect('/404')
    return utils.renderTemplate(res, req, 'case.ejs', { c, bot: client })
  })

  app.get('/case/:case/revoke', discordController.verify, async (req, res) => {
    if (!req.params.case) return res.redirect('/404')
    const c = await client.cases.delete(config.main_guild, req.params.case)
    if (!c) return res.redirect('/404')
    return res.redirect('/cases')
  })

  app.get('/case/:case/inactive', discordController.verify, (req, res) => {
    if (!req.params.case) return res.redirect('/404')
    const c = client.cases.edit(config.main_guild, req.params.case, null, 'inactive')
    if (!c) return res.redirect('/404')
    return res.redirect(`/case/${req.params.case}`)
  })

  app.get('/404', (req, res) => {
    return utils.renderTemplate(res, req, 'errors/404.ejs')
  })

  app.get('/503', (req, res) => {
    return utils.renderTemplate(res, req, 'errors/503.ejs')
  })

  app.listen(port)
  console.log(`Points Dashboard: ${port}`)
}
