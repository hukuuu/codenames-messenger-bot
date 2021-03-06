class ListRoomsExecutor {
  constructor(container) {
    container['ls'] = this
    container['list'] = this
  }

  async execute({ roomsManager, api, player }) {
    const roomIds = roomsManager.listRooms()
    return api.listRoomsMessage(player.id, roomIds)
  }
}

module.exports = ListRoomsExecutor
