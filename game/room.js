var generate = require('./cardsGenerator');
var Game = require('./game');
var gamePositions = require('./gamePositions');

class Room {
  constructor(id) {
    this.id = id;
    this.game = new Game(generate());
    this.players = [];
  }

  findPlayer(id) {
    return this.players.filter(player => player.id == id)[0]
  }

  join(player) {
    var p = this.findPlayer(player.id);
    if (!p) {
      this.players.push(player);
      player.position = 'observer';
    }
  }

  leave(player) {
    this.players = this.players.filter(p => p.id !== player.id)
  }

  findAvailablePositions() {
    var availablePositions = [];
    var takenPositions = this.players.reduce((acc, p) => {
      if (p.position)
        return acc.concat(p.position);
      else return acc;
      }, []);

    if (!takenPositions.includes(gamePositions.RED_TELL))
      availablePositions.push(gamePositions.RED_TELL)
    if (!takenPositions.includes(gamePositions.BLUE_TELL))
      availablePositions.push(gamePositions.BLUE_TELL)
    if (!takenPositions.includes(gamePositions.RED_GUESS))
      availablePositions.push(gamePositions.RED_GUESS)
    if (!takenPositions.includes(gamePositions.BLUE_GUESS))
      availablePositions.push(gamePositions.BLUE_GUESS)

    return availablePositions;
  }

  takePosition(player, position) {
    var availablePositions = this.findAvailablePositions();
    if (!availablePositions.includes(position))
      return false;

    player.position = position;
    return true;
  }
}

module.exports = Room;
