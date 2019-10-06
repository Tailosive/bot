const path = require('path')
const dataDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}dashboard${path.sep}views`)

const renderTemplate = async (res, req, template, data = {}) => {
  const admin = () => {
    if (req.session.isAdmin) return true
    else return false
  }
  const baseData = {
    path: req.path,
    user: req.isAuthenticated() ? req.user : null,
    admin: admin()
  }
  res.render(path.resolve(`${dataDir}${path.sep}${template}`), Object.assign(baseData, data))
}

module.exports = {
  renderTemplate
}
