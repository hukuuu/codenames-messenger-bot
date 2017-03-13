module.exports = function(player, room) {
  const inTurn = room.findPlayerInTurn();
  if(!inTurn || player.id !== inTurn.id)
    throw new Error('Not your turn!');
};
