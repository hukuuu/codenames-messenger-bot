var LowLevelApi = require('./LowLevelApi');
var t = require('./templates');

class FacebookApi {

  constructor(pageAccessToken) {
    this.api = new LowLevelApi(pageAccessToken);
  }

  findName(id) {
    return this.api.findName(id);
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

  welcomeToRoomMessage(senderID, roomID) {
    return this.api.sendTextMessage(senderID, t.WELCOME_TO_ROOM(roomID));
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

  showBoardMessage(senderID, game) {
    return this.api.sendTextMessage(senderID, t.BOARD(game));
  }

  playerHintedMessage(senderID, name, hint) {
    return this.api.sendTextMessage(senderID, t.PLAYER_HINTED(name, hint));
  }
  playerGuessedMessage(senderID, name, word) {
    return this.api.sendTextMessage(senderID, t.PLAYER_GUESSED(name, word));
  }

  logGameStateMessage(senderID, log) {
    return this.api.sendTextMessage(senderID, t.LOG(log));
  }

}

module.exports = FacebookApi;
