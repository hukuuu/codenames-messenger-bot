const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validateRoomExists = require('../validators/roomExists')

class ShowRoomInfoExecutor {
  constructor(container) {
    container['r'] = this
    container['room'] = this
  }

  async execute({ api, player, room }) {
    validatePlayerHasRoom(player)
    validateRoomExists(room)
    return api.showRoomInfoMessage(player.id, room)
  }
}

module.exports = ShowRoomInfoExecutor
