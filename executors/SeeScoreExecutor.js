const { partition } = require('lodash')
var Storage = require('node-storage')

const validatePlayerHasTeam = require('../validators/playerHasTeam')
const validateRoomExists = require('../validators/roomExists')

const subkey = players =>
  players
    .map(p => p.id)
    .sort()
    .join('-')

const isRed = str => {
  console.log(str)
  return str.toLowerCase().indexOf('red') > -1
}

class SeeScoreExecutor {
  constructor(container) {
    container['score'] = this
    this.scores = new Storage('./scores')
  }

  async execute({ api, player, room }) {
    validateRoomExists(room)
    validatePlayerHasTeam(player)

    const [red, blue] = partition(room.players, p => isRed(p.position))

    const [key, reverseKey] = isRed(player.position)
      ? [subkey(red) + '-' + subkey(blue), subkey(blue) + '-' + subkey(red)]
      : [subkey(blue) + '-' + subkey(red), subkey(red) + '-' + subkey(blue)]

    const ours = this.scores.get(key) || 0
    const theirs = this.scores.get(reverseKey) || 0

    const s = `${ours} : ${theirs}`
    api.scoreMessage(player.id, s)
    console.log(s)
  }
}

module.exports = SeeScoreExecutor
