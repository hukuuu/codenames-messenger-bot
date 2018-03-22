class Player {
  constructor(id, name, nickName, roomId, position) {
    this.id = id
    this.name = name
    this.roomId = roomId
    this.position = position
    this.nickName = nickName
  }

  getNiceName() {
    return this.nickName || this.name
  }

  isHinter() {
    return this.position && this.position.toLowerCase().indexOf('tell') > -1
  }

  isObserver() {
    return this.position && this.position.toLowerCase().indexOf('observer') > -1
  }

  isInRoom() {
    return this.roomId || this.roomId === 0
  }

  setPosition(pos) {
    this.position = `${this.team.toUpperCase()}_${pos.toUpperCase()}`
  }

  getTeam() {
    // return this.team ? this.team.toLowerCase() : this.team;
    if (!this.position || this.position === 'OBSERVER') return null
    return this.position.substring(0, this.position.indexOf('_')).toLowerCase()
  }
}

module.exports = Player
