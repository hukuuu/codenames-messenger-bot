const icons = {
  red: '\uD83D\uDD34',
  blue: '\uD83D\uDD35',
  neutral: '\u25EF',
  assassin: '\uD83D\uDCA3',
  arrow: '\u2794',
  check: '\u2714'
};

module.exports = {

  ROOM_CREATED: roomID => `Room "${roomID}" created.`,

  LIST_ROOMS: (roomIds) => {
    return roomIds.length
      ? `Available rooms:\n${roomIds.join(' ')}.\n(type "join <room>")`
      : `No rooms available. Why don't you create one? (type "create")`;
  },

  ROOM_DOES_NOT_EXIST: roomID => `Room ${roomID} does not exist.`,

  YOU_ARE_NOT_IN_A_ROOM: () => `You are not in a room.`,
  OK: () => `OK.`,
  POSITION_IS_BUSY: () => `Position is busy`,

  ROOM_INFO: (room) => {
    let playersInfo = room.players.map(player => `${player.getNiceName()} - ${player.position}`).join('\n')
    return `Room ${room.id}\n${playersInfo}`
  },

  BOARD_HINT: (cards, result) => {
    const t = {};
    cards.filter(c => !c.revealed).forEach(c => {
      t[c.type] = t[c.type]
        ? t[c.type].concat(c.text)
        : [c.text];
    })
    return `***ASSASSIN***\n${t.assassin.join('')}

***NEUTRAL***\n${t.neutral.join(', ')}

***RED***\n${t.red.join(', ')}

***BLUE***\n${t.blue.join(', ')}

red ${result.red} - ${result.blue} blue`;
  },
  BOARD_GUESS: (cards, result) => `***BOARD***\n${cards.filter(c => !c.revealed).map(c => c.text).join(', ')}
--------------\nred ${result.red} - ${result.blue} blue`,

  PLAYER_HINTED: (name, hint) => {
    const count = hint.count === 'infinity'
      ? '\u221E'
      : hint.count;
    return `***HINT***\n${name}: ${hint.value} - ${count}`
  },

  LOG: log => {
    let head = `***LOG***\n`;

    let body = log.map(logItem => {
      let name = logItem.player.getNiceName();
      let team = logItem.player.getTeam();

      if (logItem.action === 'hint') {
        let i = icons[team];
        let t = logItem.hint.value + ' ' + logItem.hint.count;
        return `${i} ${name} ${icons.arrow} ${t} ${i}`;
      }

      if (logItem.action === 'guess') {
        let i = icons[logItem.card.type];
        let t = logItem.card.text;
        return `${i} ${name} ${icons.arrow} ${t}`;
      }

      if (logItem.action === 'pass') {
        return `${icons.check}   ${name}`;
      }
      return '';
    })

    return head + body.join('\n');
  },

  PLAYER_GUESSED: (name, card) => `***GUESS***\n${name}: ${card.text} ${icons[card.type]}`,
  PLAYER_PASSED: name => `***PASS***\n${name} passed.`,

  TURN_CHANGED: name => `${name}'s turn.`,
  PLAYER_JOINED: name => `${name} joined the room`,
  PLAYER_TOOK_SLOT: (name, slot) => `${name} took ${slot}`,

  YOU_CAN_BE_INVITED: can => `You now can${can
    ? ''
    : ' not'} be invited!`,
  INVITE_LIST: invites => {
    if (invites.length) {
      let body = invites.map((player, i) => `${i + 1} ${player.getNiceName()}`).join('\n');
      return body + '\n-----\nInvite by number(s)';
    }
    return 'No one to invite.';
  },

  INVITED_PLAYERS: players => {
    let name = player => player.getNiceName();
    let plrs = players.length > 1
      ? players.slice(0, players.length - 1).map(name).join(', ') + ` and ${players[players.length - 1].getNiceName()}`
      : players[0].getNiceName();
    return `${plrs} invited.`
  },

  PLAYER_REJECTED_INVITE: rejector => `${rejector.getNiceName()} rejected your invite :(`,

  UNKNOWN_COMMAND: command => `Unknown command: ${command}`,

  GAME_OVER: win => `You ${win
    ? 'won ;)'
    : 'lost ;('}`,

  NEW_GAME_STARTED: `All agreed, starting a new game!`,
  KIL_ROOM: who => `${who.getNiceName()} doesn't want to play more :(\nKilling room...`,

  MORE_WORDS: more => `${more - 1} (+1) more to guess.`,

  WELCOME: `***WELCOME***`,
  ROOM_IS_READY: `Ok, all set up, lets start the game.`,

  CREATE_HELP: `c,create - create a new room.`,
  LIST_HELP: `ls,list - list all available rooms.`,
  JOIN_HELP: `j,join <id> - join particular room.`,
  TEAM_HELP: `t,team - take a team`,
  ROOM_HELP: `r,room - display room info.`,
  BOARD_HELP: `b,board - display the board.`,
  LOG_HELP: `l,log - display the game log.`,
  HINT_HELP: `h,hint <word> <number> - hint.`,
  GUESS_HELP: `g,guess <word> - guess.`,
  PASS_HELP: `p,pass - pass`,
  HELP_HELP: `help - show this help.`,
  NICK_HELP: `n,nick - choose a short nickname`,
  INVITE_HELP: `i,invite - invite buddy`,
  INVITE_CONFIG_HELP: `i,invite <on/off> - on/off invitations`

};
