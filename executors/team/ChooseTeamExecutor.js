const validatePlayerHasRoom = require('../../validators/playerHasRoom');
const validateRoomExists = require('../../validators/roomExists');

class ChooseTeamExecutor {

  constructor(container) {
    container['choose-team'] = this;
  }

  async execute({api, player, params, room}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);

    const team = params[1];

    if(team.toLowerCase() === 'observer') {
      room.takePosition(player, team);
      return api.okMessage(player.id);
    }

    return api.showPositionMenuMessage(player.id, team);
  }

}

module.exports = ChooseTeamExecutor;
