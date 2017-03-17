const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validatePlayerHasTeam = require('../validators/playerHasTeam');
const validateRoomExists = require('../validators/roomExists');
const validatePlayerIsInTurn = require('../validators/playerIsInTurn');

class HintExecutor {
  constructor(container) {
    container['hint'] = this;
  }

  validateCount(count) {
    if(count === 'infinity') return;
    if(isNaN(parseInt(count)))
      throw new Error('Hint format:\nhint <word(s)> <count>');
  }

  async execute({api, player, room, params}) {

    validateRoomExists(room);
    validatePlayerHasRoom(player);
    validatePlayerHasTeam(player);
    validatePlayerIsInTurn(player, room);


    const word = params.slice(1, params.length - 1).join(' ');
    const count = params[params.length - 1];

    this.validateCount(count);

    const hint = {
      value: word,
      count: count > 9
        ? 'infinity'
        : count
    };

    const method = player.getTeam() + 'Tell';
    room.game[method](player, hint);
    await api.broadcast(
      room.players,
      api.playerHintedMessage.bind(api),
      [player.getNiceName(), hint]
    );

    const inTurn = room.findPlayerInTurn();
    if (room.game.isTurnChanged() && inTurn) {
      await api.broadcast(room.players, api.turnChangedMessage.bind(api), [inTurn]);
    }

    return;

  }

}

module.exports = HintExecutor;
