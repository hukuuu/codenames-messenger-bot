const Storage = require('node-storage')

module.exports = {
  scores: new Storage('scores'),
  invites: new Storage('invites'),
  nicknames: new Storage('nicknames')
}
