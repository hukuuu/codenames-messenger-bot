var Player = require('./player')
var Storage = require('node-storage')

class PlayersManager {
  constructor(api) {
    this.nicknames = new Storage('./nicknames')
    this.invites = new Storage('./invites')
    this._initInvites()
    this.api = api
    this.players = []
  }

  _initInvites() {
    let notEmpty = !!this.invites.get('invites')
    if (notEmpty) return
    this.invites.put('invites', [])
  }

  async findPlayer(id) {
    let player = this.players.filter(p => p.id == id)[0]
    if (!player) {
      let name = await this.api.findName(id)
      player = new Player(id, name)
      this.players.push(player)
    }
    console.log(id, typeof id)
    player.nickName = this.getNickName(id)
    console.log(player)
    return player
  }

  getNickName(id) {
    return this.nicknames.get(id)
  }

  setNickName(id, nickName) {
    this.nicknames.put(id, nickName)
  }

  setInvite(id, on) {
    let invites = this.invites.get('invites').sort()
    let [invite, index] = invites.reduce(
      (tuple, invite, index) => (invite === id ? [invite, index] : tuple),
      []
    )

    console.log(invite, index)

    if (on) {
      if (invite) return
      invites.push(id)
    } else {
      if (!invite) return
      invites = invites.slice(0, index).concat(invites.slice(index + 1))
    }

    this.invites.put('invites', invites)
  }

  getInvites() {
    return this.invites.get('invites').sort()
  }

  findInvite(number) {
    console.log('LOG', number, typeof number)
    let invites = this.invites.get('invites').sort()
    return invites[number - 1]
  }
}

module.exports = PlayersManager
