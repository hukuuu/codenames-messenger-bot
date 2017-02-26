var Room = require('./room');
var Player = require('./player');

// var testRoom = new Room(0);
// var testPlayer = new Player(1416486275063521, 'Николай', 0, 'RED_TELL')
// testRoom.join(testPlayer);
// testRoom.takePosition(testPlayer, 'RED_TELL');
// testRoom.game.redTell(testPlayer, {value: 'traktor', count: '4'});
// testRoom.takePosition(testPlayer, 'RED_GUESS');


class RoomsManager {
  constructor() {
    this.id = 0;
    // this.rooms = [testRoom];
    this.rooms = [];
  }

  createRoom() {
    var room = new Room(this.id++);
    this.rooms.push(room);
    return room;
  }

  findRoom(id) {
    return this.rooms.filter(room => room.id == id)[0];
  }

  listRooms() {
    return this.rooms.map(room => room.id);
  }

}

module.exports = RoomsManager;
