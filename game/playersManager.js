var Player = require('./player');
var Storage = require('node-storage');

class PlayersManager {
  constructor(api) {
    this.store = new Storage('./nicknames');
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
    player.nickName = this.getNickName(id);
    console.log(player);
    return player;
  }

  getNickName(id) {
    return this.store.get(id);
  }

  setNickName(id, nickName) {
    this.store.put(id, nickName);
  }

}

module.exports = PlayersManager;
