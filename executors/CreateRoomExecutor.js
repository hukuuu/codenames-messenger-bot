class CreateRoomExecutor {

  constructor(container) {
    container['create'] = this;
  }

  async execute({roomsManager, api, player}) {
    const room = roomsManager.createRoom();
    room.join(player);
    roomsManager.removePlayerFromOtherRooms(player, room);
    await api.welcomeToRoomMessage(player.id, room);
    await api.broadcastExcept(room.players, player, api.playerJoinedMessage.bind(api), [player]);
    return api.showTeamMenuMessage(player.id);
  }

}

module.exports = CreateRoomExecutor;
