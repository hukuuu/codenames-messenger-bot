var FacebookApi = require('./facebookApi');
var RoomsManager = require('../game/roomsManager');
var PlayersManager = require('../game/playersManager');
var gp = require('../game/gamePositions');

class MessageHandler {

  constructor(pageAccessToken) {
    this.api = new FacebookApi(pageAccessToken);
    this.roomsManager = new RoomsManager();
    this.playersManager = new PlayersManager(this.api);
  }

  async handleMessage(event) {
    try {
      await this._handleMessage(event);
    } catch (e) {
      console.error(e);
      await this.api.logErrorMessage(event.sender.id, e.message);
    }
  }

  async _handleMessage(event) {
    var senderID = event.sender.id;
    var message = event.message;
    var metadata = message.metadata;
    var messageText = message.text;
    var quickReply = message.quick_reply;

    console.log(`Received message from ${senderID}: ${messageText}`);

    if (quickReply) {
      // sendTextMessage(senderID, "Quick reply tapped");
      return;
    }

    if (messageText) {
      const messageWords = messageText.toLowerCase().split(' ');
      const command = messageWords[0];
      switch (command) {
        case 'test':
          await this.api.testIconsMessage(senderID);
          break;
        case 'create':
          await this.createRoom(senderID);
          break;
        case 'list':
          await this.listRooms(senderID);
          break;
        case 'join':
          const roomId = messageWords[1];
          await this.joinRoom(senderID, roomId);
          break;
        case 'team':
          const [team, position] = messageWords.slice(1);
          await this.takeSlot(senderID, `${team}_${position}`.toUpperCase());
          break;
        case 'room':
          await this.showRoomInfo(senderID);
          break;
        case 'board':
          await this.showBoard(senderID);
          break;
        case 'log':
          await this.log(senderID);
          break;
        case 'hint':
          const hint = messageWords.slice(1, messageWords.length -1).join(' ');
          const count = messageWords[messageWords.length -1];
          await this.hint(senderID, hint, count);
          break;
        case 'guess':
          const word = messageWords.slice(1).join(' ');
          await this.guess(senderID, word);
          break;
        case 'pass':
          await this.pass(senderID);
          break;
        case 'help':
          await this.help(senderID);
          break;
        case 'nick':
          const nickName = messageWords[1];
          await this.setNickName(senderID, nickName);
          break;
        default:
          await this.api.unknownCommandMessage(senderID, command);
          break;
      }
    }
  }

  async setNickName(senderID, nickName) {
    this.playersManager.setNickName(senderID, nickName);
    return this.api.okMessage(senderID);
  }

  async help(senderID) {
    let player = await this.playersManager.findPlayer(senderID);

    if (!player.isInRoom()) {
      return this.api.helpNotInRoomMessage(senderID);
    }

    if (player.isObserver()) {
      return this.api.helpObserverMessage(senderID);
    }

    if (player.isHinter()) {
      return this.api.helpTellMessage(senderID);
    }

    if (!player.isHinter()) {
      return this.api.helpGuessMessage(senderID);
    }

  }

  async log(senderID) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    return this.api.logGameStateMessage(senderID, room.game.log);
  }

  async pass(senderID) {
    return this.play(senderID, 'pass', null, this.api.playerPassedMessage.bind(this.api));
  }

  async hint(senderID, word, count) {
    let hint = {
      value: word,
      count: count > 9 ? 'infinity' : count
    };
    await this.play(senderID, 'Tell', hint, this.api.playerHintedMessage.bind(this.api));
  }

  async guess(senderID, word) {
    await this.play(senderID, 'Guess', word, this.api.playerGuessedMessage.bind(this.api));
  }

  async play(senderID, command, value, messageMethod) {

    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }

    const team = player.getTeam();
    console.log(team);
    if (command === 'pass') {
      room.game.pass(player);
    } else if (team) {
      room.game[team + command](player, value);
      if (command === 'Guess') {
        value = room.game._findCard(value);
      }
    }

    await this.broadcast(room.players, messageMethod, [player.getNiceName(), value]);

    if(room.game.winner) {
      await Promise.all(room.players.map(p => {
        let win = p.position.toLowerCase().indexOf(room.game.winner.toLowerCase()) > -1;
        return this.api.gameOverMessage(p.id, win);
      }));
    } else if (room.game.isTurnChanged() && room.findPlayerInTurn()) {
      await this.broadcast(room.players, this.api.turnChangedMessage.bind(this.api), [room.findPlayerInTurn()]);
    }

    if(!room.game.isTurnChanged() && team) {
      const more = room.game[team+'Hint'].left;
      if(more >= 0)
        await this.api.moreWordsMessage(senderID, more);
    }

    return;
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

  async showBoard(senderID) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    if (player.isHinter()) {
      return this.api.showBoardHintMessage(senderID, room.game);
    } else {
      return this.api.showBoardGuessMessage(senderID, room.game);
    }
  }

  async takeSlot(senderID, position) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    let ok = room.takePosition(player, position);
    if (ok) {
      await this.api.okMessage(senderID);
      await this.broadcastExcept(room.players, player, this.api.playerTookSlotMessage.bind(this.api), [player, position]);
      if (room.isReady()) {
        await this.broadcast(room.players, this.api.roomIsReadyMessage.bind(this.api), []);
        await this.broadcastBoard(room.players, room.game.cards);
        await this.broadcast(room.players, this.api.turnChangedMessage.bind(this.api), [room.findPlayerInTurn()]);
      }
      return;
    }
    return this.api.positionBusyMessage(senderID);
  }

  async showRoomInfo(senderID) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    return this.api.showRoomInfoMessage(senderID, room);
  }

  async createRoom(senderID) {
    let room = this.roomsManager.createRoom();
    return this.api.roomCreatedMessage(senderID, room.id);
  }

  listRooms(senderID) {
    let roomIds = this.roomsManager.listRooms();
    return this.api.listRoomsMessage(senderID, roomIds);
  }

  async joinRoom(senderID, roomID) {
    let room = this.roomsManager.findRoom(roomID);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, roomID);
    } else {
      let player = await this.playersManager.findPlayer(senderID);
      room.join(player);
      this.roomsManager.removePlayerFromOtherRooms(player, room);
      await this.api.welcomeToRoomMessage(senderID, room);
      return this.broadcastExcept(room.players, player, this.api.playerJoinedMessage.bind(this.api), [player]);
    }
  }
}

module.exports = MessageHandler;
