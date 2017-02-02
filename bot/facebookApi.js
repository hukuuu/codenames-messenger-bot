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

}

module.exports = FacebookApi;
