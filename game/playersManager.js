var Player = require('./player');

class PlayersManager {
  constructor(api) {
    this.api = api;
    this.players = [];
  }

  async findPlayer(id) {
    let player = this.players.filter(p => p.id == id)[0];
    if(!player) {
      let name = await this.api.findName(id);
      player = new Player(id, name);
      this.players.push(player);
    }
    console.log(player);
    return player;
  }
}

module.exports = PlayersManager;
