const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validateRoomExists = require('../validators/roomExists');

class JoinTeamExecutor {

  constructor(container) {
    container['team'] = this;
  }

  async execute({api, player, room, params}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);

    const [team, pos] = params.slice(1);
    const position = `${team}_${pos}`.toUpperCase();

    const ok = room.takePosition(player, position);
    if (ok) {
      await api.okMessage(player.id);
      await api.broadcastExcept(room.players, player, api.playerTookSlotMessage.bind(api), [player, position]);
      if (room.isReady()) {
        await api.broadcast(room.players, api.roomIsReadyMessage.bind(api), []);
        await api.broadcastBoard(room.players, room.game);
        await api.broadcast(room.players, api.turnChangedMessage.bind(api), [room.findPlayerInTurn()]);
      }
      return;
    }
    return api.positionBusyMessage(player.id);
  }

}

module.exports = JoinTeamExecutor;
