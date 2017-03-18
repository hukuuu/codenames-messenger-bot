const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validateRoomExists = require('../validators/roomExists');
class InviteExecutor {

  constructor(container) {
    container['invite'] = this;
  }

  async execute({player, room, api, playersManager, params}) {

    let fp = playersManager.findPlayer.bind(playersManager);

    console.log(params);

    if (!params[1]) {
      validatePlayerHasRoom(player);
      validateRoomExists(room);
      let invites = playersManager.getInvites();
      let players = await Promise.all(invites.map(fp));
      return api.inviteListMessage(player.id, players);
    }

    if (params[1] === 'on') {
      playersManager.setInvite(player.id, true);
      return api.youNowCanBeInvitedMessage(player.id, true);
    }

    if (params[1] === 'off') {
      playersManager.setInvite(player.id, false);
      return api.youNowCanBeInvitedMessage(player.id, false);
    }

    if (params[1] === 'rejected') {
      let rejector = await playersManager.findPlayer(params[2]);
      await api.okMessage(rejector.id);
      return api.playerRejectedInviteMessage(params[3], rejector);
    }

    let invitedPlayers = [];

    validatePlayerHasRoom(player);
    validateRoomExists(room);
    let numbers = params.slice(1);
    let invites = numbers
      .map(playersManager.findInvite.bind(playersManager))
      .filter(a => !!a). // NOTE: remove nulls
    map(invite => {
      console.log(invite);
      return playersManager
        .findPlayer(invite)
        .then(p => {
          invitedPlayers.push(p);
          return api.invitePlayerMessage(p.id, player.id, room.id)
        })
    });

    return await Promise.all(invites).then(_ => {
      return api.playersInvited(player.id, invitedPlayers);
    });
  }
}

module.exports = InviteExecutor;
