var generate = require('./cardsGenerator')
var Game = require('./game')
var gp = require('./gamePositions')

class Room {
  constructor(id, config) {
    this.id = id
    this.config = config
    this.game = new Game(this.generateCards())
    this.players = []
  }

  generateCards() {
    return generate(Object.keys(this.config))
  }

  newGame() {
    this.game = new Game(this.generateCards())
    this.players.forEach(p => {
      p.position = p.isHinter()
        ? p.position.replace('TELL', 'GUESS')
        : p.position.replace('GUESS', 'TELL')
    })
  }

  findPlayer(id) {
    return this.players.filter(player => player.id == id)[0]
  }

  findPlayerInTurn() {
    return this.players.filter(p => p.position === this.game.turn)[0]
  }

  join(player) {
    var p = this.findPlayer(player.id)
    if (!p) {
      player.roomId = this.id
      this.players.push(player)
      player.position = gp.OBSERVER
    }
  }

  leave(player) {
    this.players = this.players.filter(p => p.id !== player.id)
  }

  isReady() {
    return this.findAvailablePositions().length === 0
  }

  findAvailablePositions() {
    var availablePositions = []
    var takenPositions = this.players.reduce((acc, p) => {
      if (p.position) return acc.concat(p.position)
      else return acc
    }, [])

    if (!takenPositions.includes(gp.RED_TELL))
      availablePositions.push(gp.RED_TELL)
    if (!takenPositions.includes(gp.BLUE_TELL))
      availablePositions.push(gp.BLUE_TELL)
    if (!takenPositions.includes(gp.RED_GUESS))
      availablePositions.push(gp.RED_GUESS)
    if (!takenPositions.includes(gp.BLUE_GUESS))
      availablePositions.push(gp.BLUE_GUESS)

    return availablePositions
  }

  takePosition(player, position) {
    if (position.toLowerCase().indexOf('observer') > -1) {
      player.position = gp.OBSERVER
      return true
    }

    var availablePositions = this.findAvailablePositions()
    if (!availablePositions.includes(position)) return false

    player.position = position
    return true
  }
}

module.exports = Room
