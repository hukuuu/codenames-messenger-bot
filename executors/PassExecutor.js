const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validatePlayerHasTeam = require('../validators/playerHasTeam')
const validateRoomExists = require('../validators/roomExists')
const validatePlayerIsInTurn = require('../validators/playerIsInTurn')

class PassExecutor {
  constructor(container) {
    container['p'] = this
    container['pass'] = this
  }

  async execute({ api, player, room, params }) {
    validateRoomExists(room)
    validatePlayerHasRoom(player)
    validatePlayerHasTeam(player)
    validatePlayerIsInTurn(player, room)

    room.game.pass(player)

    await api.broadcast(room.players, api.playerPassedMessage.bind(api), [
      player.getNiceName()
    ])

    const inTurn = room.findPlayerInTurn()
    if (room.game.isTurnChanged() && inTurn) {
      await api.broadcast(room.players, api.turnChangedMessage.bind(api), [
        inTurn
      ])
    }

    return
  }
}

module.exports = PassExecutor
