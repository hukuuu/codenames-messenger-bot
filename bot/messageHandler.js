var FacebookApi = require('./facebookApi');
var RoomsManager = require('../game/roomsManager');
var PlayersManager = require('../game/playersManager');

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
        value2] = messageText.split(' ');
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      switch (action) {
        case 'create':
          this.createRoom(senderID);
          break;
        case 'list':
          this.listRooms(senderID);
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
        case 'name':
          // let name = await this.api.findName(senderID);
          // this.api.sendTextMessage(senderID, name);
          break;
        default:
          // this.api.sendTextMessage(senderID, messageText);
      }
    }
  }

  async showBoard(senderID) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.roomId && player.roomId != 0) { //TODO ID 0 IS FALSE!!!
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    let game = room.game;
    return this.api.showBoardMessage(senderID, game);
  }

  async takeSlot(senderID, position) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.roomId && player.roomId != 0) { //TODO ID 0 IS FALSE!!!
      return this.api.youAreNotInARoomMessage(senderID);
    }
    let room = this.roomsManager.findRoom(player.roomId);
    if (!room) {
      return this.api.roomDoesNotExistMessage(senderID, player.roomId);
    }
    let ok = room.takePosition(player, position);
    if (ok)
      return this.api.okMessage(senderID);
    return this.api.positionBusyMessage(senderID);
  }

  async showRoomInfo(senderID) {
    let player = await this.playersManager.findPlayer(senderID);
    if (!player.roomId && player.roomId != 0) { //TODO ID 0 IS FALSE!!!
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
      player.roomId = room.id;
      console.log(player);
      return this.api.welcomeToRoomMessage(senderID, roomID);
    }
  }
}

module.exports = MessageHandler;
