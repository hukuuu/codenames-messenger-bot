'use strict';

const red = 'red'
const blue = 'blue'
const assassin = 'assassin'
const neutral = 'neutral'

const gp = require('./gamePositions');

class Game {

  constructor(cards) {
    this.cards = cards
    const initialState = this._computeInitialState(this.cards)
    this.turn = initialState.turn
    this.first = initialState.first
    this.winner = false
    this.log = []
    this.blueHint = {
      left: 0
    }
    this.redHint = {
      left: 0
    }
  }

  getTellState() {
    return this._getState()
  }

  getGuessState() {
    const state = this._getState()
    if (!this.winner)
      state.cards = this.cards.map(c => ({
        text: c.text,
        pos: c.pos,
        revealed: c.revealed,
        type: c.revealed
          ? c.type
          : undefined
      }))
    return state
  }

  redTell(player, hint) {
    if (this._validateGameTurn(gp.RED_TELL) && this._validatePlayerPosition(player)) {
      this.redHint = hint
      this.redHint.left = this._getCountValue(hint.count)
      this._logTell(player, hint)
      this.turn = gp.RED_GUESS
    }
  }

  blueTell(player, hint) {
    if (this._validateGameTurn(gp.BLUE_TELL) && this._validatePlayerPosition(player)) {
      this.blueHint = hint
      this.blueHint.left = this._getCountValue(hint.count)
      this._logTell(player, hint)
      this.turn = gp.BLUE_GUESS
    }
  }

  redGuess(player, word) {
    if (this._validateGameTurn(gp.RED_GUESS) && this._validatePlayerPosition(player)) {
      this._revealCard(word)
      this._logGuess(player, this._findCard(word))
      this._computeWinner()

      this.redHint.left--;
      if (this._findCard(word).type !== 'red' || this.redHint.left === 0)
        this.turn = gp.BLUE_TELL
    }
  }

  blueGuess(player, word) {
    if (this._validateGameTurn(gp.BLUE_GUESS) && this._validatePlayerPosition(player)) {
      this._revealCard(word)
      this._logGuess(player, this._findCard(word))
      this._computeWinner()

      this.blueHint.left--;
      if (this._findCard(word).type !== 'blue' || this.blueHint.left === 0)
        this.turn = gp.RED_TELL
    }
  }

  pass(player) {
    if (this._validateGameTurn(gp.BLUE_GUESS, gp.RED_GUESS) && this._validatePlayerPosition(player)) {
      this._logPass(player)
      if (this.turn === gp.BLUE_GUESS)
        this.turn = gp.RED_TELL
      if (this.turn === gp.RED_GUESS)
        this.turn = gp.BLUE_TELL
    }
  }

  _getState() {
    return {
      cards: this.cards,
      turn: this.turn,
      winner: this.winner,
      blueHint: this.blueHint,
      redHint: this.redHint,
      log: this.log,
      first: this.first
    }
  }

  _validatePlayerPosition(player) {
    let result = player.position === this.turn
    console.log(player.position, this.turn);
    console.log('player position: ', result);
    return result;
    // if (player.slot !== this.turn)
    // throw new Error(`Not your turn, ${player.name}...`)
  }

  _validateGameTurn() {
    let safe = false
    const turn = this.turn
    console.log('game turn:', turn);
    [].forEach.call(arguments, function (action) {
      console.log('action:', action)
      if (turn == action)
        safe = true
    })
    console.log('game turn: ', safe);
    return safe
    // if (!safe) {
    // throw new Error(`Invalid state: game turn is ${this.turn}`)
    // }
  }

  _getCountValue(count) {
    if (count === 'infinity' || count === 0)
      return 0
    return count + 1
  }

  _computeWinner() {

    const revealed = this.cards.filter(c => c.revealed)

    let reds = 0
    let blues = 0
    let assassins = 0

    revealed.forEach(c => {
      if (c.type === assassin)
        assassins++;
      if (c.type === red)
        reds++;
      if (c.type === blue)
        blues++
      }
    )

    if (assassins === 1) {
      this.winner = this.turn === gp.BLUE_GUESS
        ? 'red'
        : 'blue'
      return
    }

    if (this.first === 'red') {
      if (reds === 9) {
        this.winner = 'red'
        return
      }
      if (blues === 8) {
        this.winner = 'blue'
        return
      }
    } else {
      if (blues === 9) {
        this.winner = 'blue'
        return
      }
      if (reds === 8) {
        this.winner = 'red'
        return
      }
    }

    this.winner = false

  }

  _revealCard(word) {
    const card = this._findCard(word)
    if (!!card.revealed) {
      throw new Error('illegal state: card already revealed pos[' + pos + ']')
    } else {
      card.revealed = true
    }

  }

  _findCard(word) {
    return this.cards.filter(card => card.text.toLowerCase() === word.toLowerCase())[0];
  }

  _computeInitialState(cards) {
    const redCards = cards.filter(card => card.type === red).length
    if (redCards === 9)
      return {turn: gp.RED_TELL, first: 'red'}
    else
      return {turn: gp.BLUE_TELL, first: 'blue'}
    }

  _logPass(player) {
    this.log.push({action: 'pass', timestamp: Date.now(), player: player})
  }
  _logGuess(player, card) {
    var success = player.position.toLowerCase().indexOf(card.type) > -1;
    this.log.push({action: 'guess', timestamp: Date.now(), player: player, card: card, success: success})
  }
  _logTell(player, hint) {
    this.log.push({action: 'hint', timestamp: Date.now(), player: player, hint: hint})
  }

}

module.exports = Game;
