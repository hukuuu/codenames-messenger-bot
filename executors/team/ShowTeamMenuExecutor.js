const validatePlayerHasRoom = require('../../validators/playerHasRoom');

class ShowTeamMenuExecutor {

  constructor(container) {
    container['team'] = this;
  }

  async execute({roomsManager, api, player}) {
    validatePlayerHasRoom(player);
    return api.showTeamMenuMessage(player.id);
  }

}

module.exports = ShowTeamMenuExecutor;
