module.exports = function(player) {
  if(!player.getTeam())
    throw new Error('You are not in a team');
};
