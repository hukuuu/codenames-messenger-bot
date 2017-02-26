module.exports = {

  ROOM_CREATED: roomID => `Room "${roomID}" created.`,

  LIST_ROOMS: (roomIds) => {
    return roomIds.length
      ? `Available rooms:\n${roomIds.join(' ')}.\n(type "join <room>")`
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

  BOARD_HINT: cards => {
    const t = {};
    cards.filter(c => !c.revealed).forEach(c => {
      t[c.type] = t[c.type]
        ? t[c.type].concat(c.text)
        : [c.text];
    })
    return `***ASSASSIN***\n${t.assassin.join('')}

***NEUTRAL***\n${t.neutral.join(', ')}

***RED***\n${t.red.join(', ')}

***BLUE***\n${t.blue.join(', ')}`;
  },
  BOARD_GUESS: cards => `***BOARD***\n${cards.filter(c => !c.revealed).map(c => c.text).join(', ')}`,

  PLAYER_HINTED: (name, hint) => `***HINT***\n${name}: ${hint.value} - ${hint.count}`,

  LOG: log => {
    let head = `***LOG***\n`;

    let body = log.map(logItem => {
      let name = logItem.player.getNiceName();
      let card = '';
      if (logItem.card)
        card = logItem.card.text + ' ' + (logItem.success
          ? '\u2714'
          : '\u2718');
      let hint = logItem.hint
        ? logItem.hint.value + ' ' + logItem.hint.count
        : '';

      let action = logItem.action === 'pass'
        ? '\u2714'
        : '\u2794';

      return `${name} ${action} ${card} ${hint}`
    })

    return head + body.join('\n');
  },

  PLAYER_GUESSED: (name, word) => `***GUESS***\n${name}: ${word}`,
  PLAYER_PASSED: name => `***PASS***\n${name} passed.`,

  TURN_CHANGED: name => `${name}'s turn.`,
  PLAYER_JOINED: name => `${name} joined the room`,
  PLAYER_TOOK_SLOT: (name, slot) => `${name} took ${slot}`,

  CREATE_HELP: `create - create a new room.`,
  LIST_HELP: `list - list all available rooms.`,
  JOIN_HELP: `join <id> - join particular room.`,
  TEAM_HELP: `team <red/blue> <tell/guess> - take a team ( red or blue ) and a position ( tell or guess ).`,
  ROOM_HELP: `room - display room info.`,
  BOARD_HELP: `board - display the board.`,
  LOG_HELP: `log - display the game log.`,
  HINT_HELP: `hint <word> <number> - hint.`,
  GUESS_HELP: `guess <word> - guess.`,
  PASS_HELP: `pass - pass`,
  HELP_HELP: `help - show this help.`

};
