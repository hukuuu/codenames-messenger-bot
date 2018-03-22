const validatePlayerHasRoom = require('../validators/playerHasRoom')
const validatePlayerHasTeam = require('../validators/playerHasTeam')
const validateRoomExists = require('../validators/roomExists')
const validatePlayerIsInTurn = require('../validators/playerIsInTurn')

class NickExecutor {
  constructor(container) {
    container['n'] = this
    container['nick'] = this
  }

  async execute({ api, player, params, playersManager }) {
    const nickName = params[1]

    playersManager.setNickName(player.id, nickName)
    return api.okMessage(player.id)
  }
}

module.exports = NickExecutor
