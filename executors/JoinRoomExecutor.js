const validateRoomExists = require('../validators/roomExists')

class JoinRoomExecutor {
  constructor(container) {
    container['j'] = this
    container['join'] = this
  }

  async execute({ roomsManager, player, api, params }) {
    const roomID = params[1]
    const room = roomsManager.findRoom(roomID)

    validateRoomExists(room)

    room.join(player)
    roomsManager.removePlayerFromOtherRooms(player, room)
    await api.welcomeToRoomMessage(player.id, room)
    await api.broadcastExcept(
      room.players,
      player,
      api.playerJoinedMessage.bind(api),
      [player]
    )
    return api.showTeamMenuMessage(player.id)
  }
}

module.exports = JoinRoomExecutor
