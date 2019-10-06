const config = require('../../config')
const url = require('url')

exports.login = (req, res, next) => {
  if (req.headers.referer) {
    const parsed = new url.URL(req.headers.referer)
    if (parsed.hostname === process.env.URL) {
      req.session.backURL = parsed.path
    }
  }
  next()
}

exports.callback = (req, res) => {
  if (config.owner === req.user.id) req.session.isAdmin = true
  else req.session.isAdmin = false
  // const checkMod = auth.get(`${req.user.id}`)
  // if (!checkMod) {
  //  req.logout()
  //  return res.redirect('/')
  // }
  if (req.session.backURL) {
    const backURL = req.session.backURL
    req.session.backURL = null
    return res.redirect(backURL)
  } else {
    return res.redirect('/')
  }
}

exports.logout = (req, res) => {
  return req.session.destroy(() => {
    req.logout()
    return res.redirect('/')
  })
}

exports.verify = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  req.session.backURL = req.url
  return res.redirect('/discord/login')
}
