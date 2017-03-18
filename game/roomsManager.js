var Room = require('./room');
var Player = require('./player');

// var testRoom = new Room(0);
// testRoom.game.winner = 'red';

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

  removePlayerFromOtherRooms(player, room) {
    this.rooms.forEach(r => {
      if (r.id !== room.id)
        r.leave(player);
      }
    );
  }

  killRoom(id) {
    this.rooms = this.rooms.filter(r => r.id != id);
  }

}

module.exports = RoomsManager;
