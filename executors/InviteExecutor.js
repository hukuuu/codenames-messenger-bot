const validatePlayerHasRoom = require('../validators/playerHasRoom');
const validateRoomExists = require('../validators/roomExists');class InviteExecutor {

  constructor(container) {
    container['invite'] = this;
  }

  async execute({player, room, api, playersManager, params}) {
    validatePlayerHasRoom(player);
    validateRoomExists(room);

    let fp = playersManager.findPlayer.bind(playersManager);

    console.log(params);

    if(!params[1]) {
      let invites = playersManager.getInvites();
      let players = await Promise.all(invites.map(fp));
      return api.inviteListMessage(player.id, players);
    }

    if(params[1] === 'on') {
      playersManager.setInvite(player.id, true);
      return api.youNowCanBeInvitedMessage(player.id, true);
    }

    if(params[1] === 'off') {
      playersManager.setInvite(player.id, false);
      return api.youNowCanBeInvitedMessage(player.id, false);
    }

    if(params[1] === 'rejected') {
      let rejector = await playersManager.findPlayer(params[2]);
      await api.okMessage(rejector.id);
      return api.playerRejectedInviteMessage(player.id, rejector);
    }


    let numbers = params.slice(1);
    let invites = numbers
      .map(number => {
        let i = playersManager.findInvite(number);
        console.log(number, i);
        return i;
      })
      .filter(a => !!a) // NOTE: remove nulls
      .map(invite => {
        console.log(invite);
        let promise = playersManager.findPlayer(invite)
        .then(p => api.invitePlayerMessage(p.id, room.id))

        return promise;
      });

    return await Promise.all(invites);
  }
}

module.exports = InviteExecutor;
