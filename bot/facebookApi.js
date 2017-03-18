var LowLevelApi = require('./LowLevelApi');
var t = require('./templates');

class FacebookApi {

  constructor(pageAccessToken) {
    this.api = new LowLevelApi(pageAccessToken);
  }

  testIconsMessage(playerId) {
    return this.api.sendTextMessage(playerId, [
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


  findName(id) {
    return this.api.findName(id);
  }

  broadcast(players, f, args) {
    return Promise.all(players.map(p => f.apply(null, [p.id].concat(args))));
  }

  broadcastExcept(players, ex, f, args) {
    return this.broadcast(players.filter(p => p.id !== ex.id), f, args);
  }

  broadcastBoard(players, game) {
    return Promise.all(players.map(p => {
      return p.isHinter()
        ? this.showBoardHintMessage(p.id, game)
        : this.showBoardGuessMessage(p.id, game);
    }));
  }

  youNowCanBeInvitedMessage(playerId, can) {
    return this.api.sendTextMessage(playerId, t.YOU_CAN_BE_INVITED(can));
  }

  inviteListMessage(playerId, invites) {
    return this.api.sendTextMessage(playerId, t.INVITE_LIST(invites));
  }

  invitePlayerMessage(playerId, fromId, roomId) {
    const replies = [{
        "content_type": "text",
        "title": "Accept",
        "payload": `join ${roomId}`
    }, {
        "content_type": "text",
        "title": "Reject",
        "payload": `invite rejected ${playerId} ${fromId}`
    }];
    return this.api.sendQuickReply(playerId, `You are invited to room ${roomId}`, replies);
  }

  playersInvited(playerId, invitedPlayers) {
    return this.api.sendTextMessage(playerId, t.INVITED_PLAYERS(invitedPlayers));
  }

  playerRejectedInviteMessage(playerId, rejector) {
    return this.api.sendTextMessage(playerId, t.PLAYER_REJECTED_INVITE(rejector));
  }

  showTeamMenuMessage(playerId) {
    const replies = [
      {
        "content_type": "text",
        "title": "Red",
        "payload": "choose-team red"
      }, {
        "content_type": "text",
        "title": "Blue",
        "payload": "choose-team blue"
      }, {
        "content_type": "text",
        "title": "Observer",
        "payload": "choose-team observer"
      }
    ];
    return this.api.sendQuickReply(playerId, 'Pick a team:', replies);
  }

  showPositionMenuMessage(playerId, team) {
    const replies = [
      {
        "content_type": "text",
        "title": "Tell",
        "payload": `choose-position ${team}_tell`
      }, {
        "content_type": "text",
        "title": "Guess",
        "payload": `choose-position ${team}_guess`
      }
    ];
    return this.api.sendQuickReply(playerId, 'Pick a position:', replies);
  }

  logErrorMessage(playerId, error) {
    return this.api.sendTextMessage(playerId, error);
  }

  unknownCommandMessage(playerId, command) {
    return this.api.sendTextMessage(playerId, t.UNKNOWN_COMMAND(command));
  }

  roomCreatedMessage(playerId, roomID) {
    return this.api.sendTextMessage(playerId, t.ROOM_CREATED(roomID));
  }

  listRoomsMessage(playerId, roomIds) {
    return this.api.sendTextMessage(playerId, t.LIST_ROOMS(roomIds));
  }

  roomDoesNotExistMessage(playerId, roomID) {
    return this.api.sendTextMessage(playerId, t.ROOM_DOES_NOT_EXIST(roomID));
  }

  async welcomeToRoomMessage(playerId, room) {
    await this.api.sendTextMessage(playerId, t.WELCOME);
    return await this.api.sendTextMessage(playerId, t.ROOM_INFO(room));
  }

  youAreNotInARoomMessage(playerId) {
    return this.api.sendTextMessage(playerId, t.YOU_ARE_NOT_IN_A_ROOM());
  }
  okMessage(playerId) {
    return this.api.sendTextMessage(playerId, t.OK());
  }
  positionBusyMessage(playerId) {
    return this.api.sendTextMessage(playerId, t.POSITION_IS_BUSY());
  }
  showRoomInfoMessage(playerId, room) {
    return this.api.sendTextMessage(playerId, t.ROOM_INFO(room));
  }

  showBoardHintMessage(playerId, game) {
    return this.api.sendTextMessage(playerId, t.BOARD_HINT(game.cards, game.getResult()));
  }
  showBoardGuessMessage(playerId, game) {
    return this.api.sendTextMessage(playerId, t.BOARD_GUESS(game.cards, game.getResult()));
  }

  playerHintedMessage(playerId, name, hint) {
    return this.api.sendTextMessage(playerId, t.PLAYER_HINTED(name, hint));
  }
  playerGuessedMessage(playerId, name, card) {
    return this.api.sendTextMessage(playerId, t.PLAYER_GUESSED(name, card));
  }

  playerPassedMessage(playerId, name) {
    return this.api.sendTextMessage(playerId, t.PLAYER_PASSED(name));
  }

  logGameStateMessage(playerId, log) {
    return this.api.sendTextMessage(playerId, t.LOG(log));
  }

  helpNotInRoomMessage(playerId) {
    let composite = [t.LIST_HELP, t.CREATE_HELP, t.JOIN_HELP, t.NICK_HELP, t.INVITE_HELP, t.INVITE_CONFIG_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(playerId, composite);
  }

  helpTellMessage(playerId) {
    let composite = [t.ROOM_HELP, t.BOARD_HELP, t.LOG_HELP, t.HINT_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(playerId, composite);
  }

  helpGuessMessage(playerId) {
    let composite = [t.ROOM_HELP, t.BOARD_HELP, t.LOG_HELP, t.GUESS_HELP, t.PASS_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(playerId, composite);
  }

  helpObserverMessage(playerId) {
    let composite = [t.TEAM_HELP, t.BOARD_HELP, t.LOG_HELP, t.HELP_HELP].join('\n');
    return this.api.sendTextMessage(playerId, composite);
  }

  turnChangedMessage(playerId, playerInTurn) {
    return this.api.sendTextMessage(playerId, t.TURN_CHANGED(playerInTurn.getNiceName()));
  }

  playerJoinedMessage(playerId, player) {
    return this.api.sendTextMessage(playerId, t.PLAYER_JOINED(player.getNiceName()));
  }

  playerTookSlotMessage(playerId, player, slot) {
    return this.api.sendTextMessage(playerId, t.PLAYER_TOOK_SLOT(player.getNiceName(), slot));
  }

  roomIsReadyMessage(playerId) {
    return this.api.sendTextMessage(playerId, t.ROOM_IS_READY);
  }

  gameOverMessage(playerId, win) {
    let message = t.GAME_OVER(win) +
      '\n----\nOne more game?';

    let replies = [{
        "content_type": "text",
        "title": "Accept",
        "payload": `newgame ok`
      }, {
        "content_type": "text",
        "title": "Reject",
        "payload": `newgame no`
      }];

    return this.api.sendQuickReply(playerId, message, replies);
  }
  playerDoesntWantToPlayMore(playerId, who) {
    return this.api.sendTextMessage(playerId, t.KIL_ROOM(who));
  }
  newGameStarted(playerId) {
    return this.api.sendTextMessage(playerId, t.NEW_GAME_STARTED);
  }

  moreWordsMessage(playerId, more) {
    return this.api.sendTextMessage(playerId, t.MORE_WORDS(more));
  }

}

module.exports = FacebookApi;
