const shuffle = require('mout/array/shuffle');
const words = require('./words.json').words

const types = Array(8).fill('red').concat(Array(8).fill('blue')).concat(Array(7).fill('neutral'))
  .concat(Math.random() >= 0.5
    ? 'red'
    : 'blue')
    .concat('assassin');

const generate = () => {

  const shuffled = shuffle(words)

  let i = 0
  const cards = types.map(type => ({
    text: shuffled[i],
    type: type,
    pos: i++,
    revealed: false
  }));

  return shuffle(cards)
}

module.exports = generate;
