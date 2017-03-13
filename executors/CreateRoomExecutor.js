class CreateRoomExecutor {

  constructor(container) {
    container['create'] = this;
  }

  async execute({roomsManager, api, player}) {
    const room = roomsManager.createRoom();
    return api.roomCreatedMessage(player.id, room.id);
  }

}

module.exports = CreateRoomExecutor;
