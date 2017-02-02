module.exports = {

  ROOM_CREATED: roomID => `Room "${roomID}" created.`,

  LIST_ROOMS: (roomIds) => {
    return roomIds.length
      ? `Available rooms:\n${roomIds.join(' ')}.\n(type "joie <room>")`
      : `No rooms available. Why don't you create one? (type "create")`;
  },

  ROOM_DOES_NOT_EXIST: roomID => `Room ${roomID} does not exist.`,

  WELCOME_TO_ROOM: roomID => `Welcome to room ${roomID}`

};
