const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validateRoomExists = require('../validators/roomExists')

class ShowBoardExecutor {
  constructor(container) {
    container['b'] = this
    container['board'] = this
  }

  async execute({ api, player, room }) {
    validatePlayerHasRoom(player)
    validateRoomExists(room)

    if (player.isHinter()) {
      return api.showBoardHintMessage(player.id, room.game)
    } else {
      return api.showBoardGuessMessage(player.id, room.game)
    }
  }
}

module.exports = ShowBoardExecutor
