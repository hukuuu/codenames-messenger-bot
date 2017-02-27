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
      var [action,
        value,
        value2] = messageText.toLowerCase().split(' ');
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      switch (action) {
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
          await this.joinRoom(senderID, value);
          break;
        case 'team':
          await this.takeSlot(senderID, `${value}_${value2}`.toUpperCase());
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
          let [hint,
            count] = [value, value2];
          await this.hint(senderID, hint, count);
          break;
        case 'guess':
          let word = value;
          await this.guess(senderID, word);
          break;
        case 'pass':
          await this.pass(senderID);
          break;
        case 'help':
          await this.help(senderID);
          break;
        case 'nick':
          let nickName = value;
          await this.setNickName(senderID, nickName);
          break;
        default:
          await this.api.unknownCommandMessage(senderID, action);
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
    console.log(room.game.log);
    return this.api.logGameStateMessage(senderID, room.game.log);
  }

  async pass(senderID) {
    return this.play(senderID, 'pass', null, this.api.playerPassedMessage.bind(this.api));
  }

  async hint(senderID, word, count) {
    let hint = {
      value: word,
      count: count
    };
    await this.play(senderID, 'Tell', hint, this.api.playerHintedMessage.bind(this.api));
  }

  async guess(senderID, word) {
    await this.play(senderID, 'Guess', word, this.api.playerGuessedMessage.bind(this.api));
  }

  async play(senderID, action, value, messageMethod) {

    let player = await this.playersManager.findPlayer(senderID);
    if (!player.isInRoom()) {
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }

    if (action === 'pass') {
      room.game.pass(player);
    } else if (player.position) {
      let prefix = player.position.substring(0, player.position.indexOf('_')).toLowerCase();
      room.game[prefix + action](player, value);
      if (action === 'Guess') {
        var card = room.game._findCard(value);
        var suf = card.type.toLowerCase() === prefix
          ? '\u2714'
          : '\u2718';
        value = `${value} ${suf}`;
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
      return this.api.showBoardHintMessage(senderID, room.game.cards);
    } else {
      return this.api.showBoardGuessMessage(senderID, room.game.cards);
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
      if (room.isReady()) {
        await this.broadcast(room.players, this.api.roomIsReadyMessage.bind(this.api), []);
        await this.broadcastBoard(room.players, room.game.cards);
        await this.broadcast(room.players, this.api.turnChangedMessage.bind(this.api), [room.findPlayerInTurn()]);
      }
      return this.broadcastExcept(room.players, player, this.api.playerTookSlotMessage.bind(this.api), [player, position]);
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

  createRoom(senderID) {
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
      console.log(player);
      await this.api.welcomeToRoomMessage(senderID, room);
      return this.broadcastExcept(room.players, player, this.api.playerJoinedMessage.bind(this.api), [player]);
    }
  }
}

module.exports = MessageHandler;
