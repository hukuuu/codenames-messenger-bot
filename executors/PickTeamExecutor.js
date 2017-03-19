const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validateRoomExists = require('../validators/roomExists');

class PickTeamExecutor {

  constructor(container) {
    container['t'] = this;
    container['team'] = this;
    container['choose-team'] = this;
    container['choose-position'] = this;
  }

  async execute({player, room, api, params}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);

    let command = params[0];

    if (command === 'team' || command === 't') {
      return api.showTeamMenuMessage(player.id);
    }

    if (command === 'choose-team') {
      const team = params[1];

      if (team.toLowerCase() === 'observer') {
        room.takePosition(player, team);
        return api.okMessage(player.id);
      }

      return api.showPositionMenuMessage(player.id, team);
    }

    if (command === 'choose-position') {
      const ok = room.takePosition(player, params[1].toUpperCase());
      if (ok) {
        await api.okMessage(player.id);
        await api.broadcastExcept(room.players, player, api.playerTookSlotMessage.bind(api), [player, params[1]]);
        if (room.isReady()) {
          await api.broadcast(room.players, api.roomIsReadyMessage.bind(api), []);
          await api.broadcastBoard(room.players, room.game);
          await api.broadcast(room.players, api.turnChangedMessage.bind(api), [room.findPlayerInTurn()]);
        }
        return;
      }
      return api.positionBusyMessage(player.id);
    }
    return;
  }
}

module.exports = PickTeamExecutor;
