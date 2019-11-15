const config = require('../../config')
const url = require('url')
const Database = require('../../structures/TailosiveDatabase')
const mods = new Database.ModDatabase()
const furl = process.env.NODE_ENV !== 'development' ? 'mods.tailosive.net' : 'localhost'

exports.login = (req, res, next) => {
  if (req.headers.referer) {
    const parsed = new url.URL(req.headers.referer)
    if (parsed.hostname === furl) {
      req.session.backURL = parsed.path
    }
  }
  next()
}

exports.callback = async (req, res) => {
  if (config.owner === req.user.id) req.session.isAdmin = true
  else req.session.isAdmin = false
  const checkMod = await mods.get(config.main_guild, req.user.id)
  if (!checkMod) {
    req.logout()
    return res.redirect('/')
  }
  if (req.session.backURL) {
    const backURL = req.session.backURL === '/' ? '/cases' : req.session.backURL
    req.session.backURL = null
    return res.redirect(backURL)
  } else {
    return res.redirect('/cases')
  }
}

exports.logout = (req, res) => {
  return req.session.destroy(() => {
    req.logout()
    return res.redirect('/')
  })
}

exports.verify = (req, res, next) => {
  if (req.user) return next()
  return res.redirect('/discord/login')
}
