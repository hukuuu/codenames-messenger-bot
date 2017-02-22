module.exports = {

  ROOM_CREATED: roomID => `Room "${roomID}" created.`,

  LIST_ROOMS: (roomIds) => {
    return roomIds.length
      ? `Available rooms:\n${roomIds.join(' ')}.\n(type "joie <room>")`
      : `No rooms available. Why don't you create one? (type "create")`;
  },

  ROOM_DOES_NOT_EXIST: roomID => `Room ${roomID} does not exist.`,

  WELCOME_TO_ROOM: roomID => `Welcome to room ${roomID}`,

  YOU_ARE_NOT_IN_A_ROOM: () => `You are not in a room.`,
  OK: () => `OK.`,
  POSITION_IS_BUSY: () => `Position is busy`,

  ROOM_INFO: (room) => {
    let playersInfo = room.players.map(player => `${player.name} - ${player.position}`).join('\n')
    return `Room ${room.id}\n${playersInfo}`
  },

  BOARD: game => {
    let assassin;
    let neutral = [];
    let red = [];
    let blue = [];
    game.cards.forEach(card => {
      if (card.type === 'assassin')
        assassin = card.text;
      if (card.type === 'neutral')
        neutral.push(card.text);
      if (card.type === 'red')
        red.push(card.text);
      if (card.type === 'blue')
        blue.push(card.text);
      }
    );
    return `***ASSASSIN***\n${assassin}

***NEUTRAL***\n${neutral.join(', ')}

***RED***\n${red.join(', ')}

***BLUE***\n${blue.join(', ')}`;
  },

  PLAYER_HINTED: (name, hint) => `***HINT***\n${name}: ${hint.value} - ${hint.count}`,

  LOG: log => {
    let head = `***LOG***\n`;

    let body = log.map(logItem => {
      let name = logItem.player.name;
      let card = logItem.card;
      let hint = logItem.hint;
      return `${name} ${logItem.action} ${card? card.text: ''} ${hint? hint.value + ' ' + hint.count : ''}\n`
    })

    return head + body;
  },

  PLAYER_GUESSED: (name, word) => `***GUESS***\n${name}: ${word}`,
};
