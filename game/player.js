class Player {
  constructor(id, name, nickName, roomId, position) {
    this.id = id;
    this.name = name;
    this.roomId = roomId;
    this.position = position;
    this.nickName = nickName;
  }

  getNiceName() {
    return this.nickName || this.name;
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
