import { getDeckList, getDeckListName, getDeckListsFromUser } from '../../modules/mtg/decks';
import { getScryfallApiData } from '../../modules/mtg/cards';

export default {
    Deck: {
        cards: async ({ url }) => {
            return await getDeckList(url);
        },
        name: async ({ url }) => {
            return await getDeckListName(url);
        },
        commander: async ({ url, name }) => {
            if (name.includes("EDH Commander Deck"))
                return {
                    name: name.split(" EDH Commander Deck")[0]
                };
            return await getDeckList(url)[0];
        }
    },
    Card: {
        scryfallApiData: async ({ name }) => {
            return await getScryfallApiData(name);
        }
    },
    User: {
        decks: async ({ user }) => {
            return await getDeckListsFromUser(user);
        }
    }
};
