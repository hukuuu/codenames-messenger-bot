const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validatePlayerHasTeam = require('../validators/playerHasTeam')
const validateRoomExists = require('../validators/roomExists')
const validatePlayerIsInTurn = require('../validators/playerIsInTurn')

class GuessExecutor {
  constructor(container) {
    container['g'] = this
    container['guess'] = this
  }

  async execute({ api, player, room, params }) {
    validateRoomExists(room)
    validatePlayerHasRoom(player)
    validatePlayerHasTeam(player)
    validatePlayerIsInTurn(player, room)

    const word = params.slice(1).join(' ')
    const method = player.getTeam() + 'Guess'
    room.game[method](player, word)

    const card = room.game._findCard(word)
    await api.broadcast(room.players, api.playerGuessedMessage.bind(api), [
      player.getNiceName(),
      card
    ])

    if (room.game.winner) {
      return await Promise.all(
        room.players.map(p => {
          let win =
            p.position.toLowerCase().indexOf(room.game.winner.toLowerCase()) >
            -1
          return api.gameOverMessage(p, room.game, win)
        })
      )
    } else if (room.game.isTurnChanged() && room.findPlayerInTurn()) {
      await api.broadcast(room.players, api.turnChangedMessage.bind(api), [
        room.findPlayerInTurn()
      ])
    }

    const team = player.getTeam()
    if (!room.game.isTurnChanged() && team) {
      const more = room.game[team + 'Hint'].left
      if (more >= 0) await api.moreWordsMessage(player.id, more)
    }
  }
}

module.exports = GuessExecutor
