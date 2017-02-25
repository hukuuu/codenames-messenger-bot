class Player {
  constructor(id, name, roomId, position) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.position = position;
  }

  getNiceName() {
    return this.name.substring(0, 5);
  }

  isHinter() {
    return this.position && this.position.toLowerCase().indexOf('tell') > -1;
  }

  isObserver() {
    return this.position && this.position.toLowerCase().indexOf('observer') > -1;
  }

  isInRoom() {
    return this.roomId || this.roomId === 0;
  }

}

module.exports = Player;
