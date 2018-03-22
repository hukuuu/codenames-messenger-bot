module.exports = player => {
  if (!player.isInRoom()) throw new Error('You are not in a room!')
}
