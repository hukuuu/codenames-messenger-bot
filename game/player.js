class Player {
  constructor(id, name, roomId, position) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.position = position;
  }

  isHinter() {
    return this.position && this.position.toLowerCase().indexOf('tell') > -1;
  }
}

module.exports = Player;
