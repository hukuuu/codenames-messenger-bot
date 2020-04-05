const shuffle = require('mout/array/shuffle')
const words = require('./words.json')

const makeTypes = () =>
  Array(8)
    .fill('red')
    .concat(Array(8).fill('blue'))
    .concat(Array(7).fill('neutral'))
    .concat(Math.random() >= 0.5 ? 'red' : 'blue')
    .concat('assassin')

const generate = config => {
  let allWords = []
  for (key of config) {
    allWords = allWords.concat(words[key])
  }
  const unique = Array.from(new Set(allWords))
  console.log(`generating ${unique.length}`)
  const shuffled = shuffle(unique)

  let i = 0
  const cards = makeTypes().map(type => ({
    text: shuffled[i],
    type: type,
    pos: i++,
    revealed: false
  }))

  return shuffle(cards)
}

module.exports = generate
