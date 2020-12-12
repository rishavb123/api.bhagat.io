const { get } = require('request-promise');
const { getStringDeckList } = require('./modules/mtg/decks');

const url = 'https://scryfall.com/@rishavb123/decks/2e961cff-f599-4253-952e-ab66874f4b89';

getStringDeckList(url).then(console.log)