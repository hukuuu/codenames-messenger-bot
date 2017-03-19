const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validateRoomExists = require('../validators/roomExists');

class ShowLogExecutor {

  constructor(container) {
    container['l'] = this;
    container['log'] = this;
  }

  async execute({api, player, room}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);
    return api.logGameStateMessage(player.id, room.game.log);
  }

}

module.exports = ShowLogExecutor;
