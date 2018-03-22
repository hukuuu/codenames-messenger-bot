const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validatePlayerHasTeam = require('../validators/playerHasTeam')
const validateRoomExists = require('../validators/roomExists')
const validatePlayerIsInTurn = require('../validators/playerIsInTurn')

class HelpExecutor {
  constructor(container) {
    container['help'] = this
  }

  async execute({ api, player }) {
    if (!player.isInRoom()) {
      return api.helpNotInRoomMessage(player.id)
    }

    if (player.isObserver()) {
      return api.helpObserverMessage(player.id)
    }

    if (player.isHinter()) {
      return api.helpTellMessage(player.id)
    }

    if (!player.isHinter()) {
      return api.helpGuessMessage(player.id)
    }
  }
}

module.exports = HelpExecutor
