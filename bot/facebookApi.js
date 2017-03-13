var LowLevelApi = require('./LowLevelApi');
var t = require('./templates');

class FacebookApi {

  constructor(pageAccessToken) {
    this.api = new LowLevelApi(pageAccessToken);
  }

  findName(id) {
    return this.api.findName(id);
  }

  broadcast(players, f, args) {
    return Promise.all(players.map(p => f.apply(null, [p.id].concat(args))));
  }

  broadcastExcept(players, ex, f, args) {
    return this.broadcast(players.filter(p => p.id !== ex.id), f, args);
  }

  broadcastBoard(players, cards) {
    return Promise.all(players.map(p => {
      return p.isHinter()
        ? this.api.showBoardHintMessage(p.id, cards)
        : this.api.showBoardGuessMessage(p.id, cards);
    }));
  }

  testIconsMessage(senderID) {
    return this.api.sendTextMessage(senderID, [
      'bomb: \uD83D\uDCA3',
      'boom: \uD83D\uDCA5',
      'large red circle: \uD83D\uDD34',
      'persevere: \uD83D\uDE23',
      'dizzy face: \uD83D\uDE35',
      'cry: \uD83D\uDE2D',
      'red \uD83D\uDD34',
      'blue \uD83D\uDD35',
      'neutral \u25EF',
      'assassin \u2B24'
    ].join('\n'));
  }

  logErrorMessage(senderID, error) {
    return this.api.sendTextMessage(senderID, error);
  }

  unknownCommandMessage(senderID, command) {
    return this.api.sendTextMessage(senderID, t.UNKNOWN_COMMAND(command));
  }

  roomCreatedMessage(senderID, roomID) {
    return this.api.sendTextMessage(senderID, t.ROOM_CREATED(roomID));
  }

  listRoomsMessage(senderID, roomIds) {
    return this.api.sendTextMessage(senderID, t.LIST_ROOMS(roomIds));
  }

  roomDoesNotExistMessage(senderID, roomID) {
    return this.api.sendTextMessage(senderID, t.ROOM_DOES_NOT_EXIST(roomID));
  }

  async welcomeToRoomMessage(senderID, room) {
    await this.api.sendTextMessage(senderID, t.WELCOME);
    await this.api.sendTextMessage(senderID, t.ROOM_INFO(room));
    return this.api.sendTextMessage(senderID, t.TEAM_HELP);
  }

  youAreNotInARoomMessage(senderID) {
    return this.api.sendTextMessage(senderID, t.YOU_ARE_NOT_IN_A_ROOM());
  }
  okMessage(senderID) {
    return this.api.sendTextMessage(senderID, t.OK());
  }
  positionBusyMessage(senderID) {
    return this.api.sendTextMessage(senderID, t.POSITION_IS_BUSY());
  }
  showRoomInfoMessage(senderID, room) {
    return this.api.sendTextMessage(senderID, t.ROOM_INFO(room));
  }

  showBoardHintMessage(senderID, game) {
    return this.api.sendTextMessage(senderID, t.BOARD_HINT(game.cards, game.getResult()));
  }
  showBoardGuessMessage(senderID, game) {
    return this.api.sendTextMessage(senderID, t.BOARD_GUESS(game.cards, game.getResult()));
  }

  playerHintedMessage(senderID, name, hint) {
    return this.api.sendTextMessage(senderID, t.PLAYER_HINTED(name, hint));
  }
  playerGuessedMessage(senderID, name, card) {
    return this.api.sendTextMessage(senderID, t.PLAYER_GUESSED(name, card));
  }

  playerPassedMessage(senderID, name) {
    return this.api.sendTextMessage(senderID, t.PLAYER_PASSED(name));
  }

  logGameStateMessage(senderID, log) {
    return this.api.sendTextMessage(senderID, t.LOG(log));
  }

  helpNotInRoomMessage(senderID) {
    let composite = [t.LIST_HELP, t.CREATE_HELP, t.JOIN_HELP, t.NICK_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(senderID, composite);
  }

  helpTellMessage(senderID) {
    let composite = [t.ROOM_HELP, t.BOARD_HELP, t.LOG_HELP, t.HINT_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(senderID, composite);
  }

  helpGuessMessage(senderID) {
    let composite = [t.ROOM_HELP, t.BOARD_HELP, t.LOG_HELP, t.GUESS_HELP, t.PASS_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(senderID, composite);
  }

  helpObserverMessage(senderID) {
    let composite = [t.TEAM_HELP, t.BOARD_HELP, t.LOG_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(senderID, composite);
  }

  turnChangedMessage(senderID, playerInTurn) {
    return this.api.sendTextMessage(senderID, t.TURN_CHANGED(playerInTurn.getNiceName()));
  }

  playerJoinedMessage(senderID, player) {
    return this.api.sendTextMessage(senderID, t.PLAYER_JOINED(player.getNiceName()));
  }

  playerTookSlotMessage(senderID, player, slot) {
    return this.api.sendTextMessage(senderID, t.PLAYER_TOOK_SLOT(player.getNiceName(), slot));
  }

  roomIsReadyMessage(senderID) {
    return this.api.sendTextMessage(senderID, t.ROOM_IS_READY);
  }

  gameOverMessage(senderID, win) {
    return this.api.sendTextMessage(senderID, t.GAME_OVER(win));
  }

  moreWordsMessage(senderID, more) {
    return this.api.sendTextMessage(senderID, t.MORE_WORDS(more));
  }

}

module.exports = FacebookApi;
