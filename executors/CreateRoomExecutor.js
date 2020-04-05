class CreateRoomExecutor {
  constructor(container) {
    container['c'] = this
    container['create'] = this
  }

  nToConf(n) {
    return ['classic', 'duet', 'undercover'][n - 1]
  }

  async execute({ params, roomsManager, api, player }) {
    const config = params
      .slice(1)
      .reduce((config, n) => ({ ...config, [this.nToConf(n)]: true }), {})
    delete config.undefined

    if (!Object.keys(config).length) {
      return api.chooseWordsMessage(player.id)
    }

    const room = roomsManager.createRoom(config)
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

module.exports = CreateRoomExecutor
