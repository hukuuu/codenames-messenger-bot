var Room = require('./room');
var Player = require('./player');

class RoomsManager {
  constructor() {
    this.id = 0;
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
