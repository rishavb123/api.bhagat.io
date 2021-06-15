import { getDeckList, getDeckListName } from '../../modules/mtg/decks';
import { getScryfallApiData } from '../../modules/mtg/cards';

export default {
    Deck: {
        cards: async ({ url }) => {
            return await getDeckList(url);
        },
        name: async ({ url }) => {
            return await getDeckListName(url);
        },
    },
    Card: {
        scryfallApiData: async ({ name }) => {
            return await getScryfallApiData(name);
        },
    },
};
