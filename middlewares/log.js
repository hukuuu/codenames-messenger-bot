const { partition } = require('lodash')
var Storage = require('node-storage')

// an-zb: 3
// zb-an: 5

const subkey = players =>
  players
    .map(p => p.id)
    .sort()
    .join('-')

const isRed = str => str.toLowerCase().indexOf('red') > -1

const scores = new Storage('./scores')

const log = async ({ room }) => {
  if (!room || !room.game.winner) {
    return
  }

  const [red, blue] = partition(room.players, p => isRed(p.position))

  const key = isRed(room.game.winner)
    ? subkey(red) + '-' + subkey(blue)
    : subkey(blue) + '-' + subkey(red)

  let score = scores.get(key)
  if (!score) score = 0
  score++
  scores.put(key, score)
}

module.exports = log
