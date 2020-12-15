import { getDeckList } from "../../modules/mtg/decks";

const url = 'https://scryfall.com/@rishavb123/decks/2e961cff-f599-4253-952e-ab66874f4b89'

export default {
    Deck: {
        cards: async (url) => {
            return await getDeckList(url);
        }
    },
};
