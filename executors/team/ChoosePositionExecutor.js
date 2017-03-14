const validatePlayerHasRoom = require('../../validators/playerHasRoom');
const validateRoomExists = require('../../validators/roomExists');

class ChoosePositionExecutor {

  constructor(container) {
    container['choose-position'] = this;
  }

  async execute({api, player, params, room}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);
    const ok = room.takePosition(player, params[1].toUpperCase());
    if (ok) {
      await api.okMessage(player.id);
      await api.broadcastExcept(room.players, player, api.playerTookSlotMessage.bind(api), [player, params[1]]);
      if (room.isReady()) {
        await broadcast(room.players, api.roomIsReadyMessage.bind(api), []);
        await broadcastBoard(room.players, room.game.cards);
        await broadcast(room.players, api.turnChangedMessage.bind(api), [room.findPlayerInTurn()]);
      }
      return;
    }
    return api.positionBusyMessage(player.id);

  }

}

module.exports = ChoosePositionExecutor;
