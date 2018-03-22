class NewGame {
  constructor(container) {
    container['newgame'] = this
  }

  async execute({ player, room, api, roomsManager, params }) {
    if (!room.newGameVotes) room.newGameVotes = 0

    if (params[1] === 'ok') {
      room.newGameVotes++
    } else {
      await api.broadcast(
        room.players,
        api.playerDoesntWantToPlayMore.bind(api),
        [player]
      )
      roomsManager.killRoom(room.id)
      return
    }

    if (room.newGameVotes === 4) {
      room.newGameVotes = 0 //reset the votes for further use :D
      room.newGame()

      await api.broadcast(room.players, api.newGameStarted.bind(api), [])
      await api.broadcastBoard(room.players, room.game)
      await api.broadcast(room.players, api.turnChangedMessage.bind(api), [
        room.findPlayerInTurn()
      ])
      return
    }
  }
}

module.exports = NewGame
