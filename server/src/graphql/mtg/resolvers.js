import {
    getDeckDescription,
    getDeckList,
    getDeckListName,
    getDeckListsFromUser,
    getDeckType,
} from '../../modules/mtg/decks';
import { getScryfallApiData } from '../../modules/mtg/cards';

export default {
    Deck: {
        cards: async ({ url, cards }) => {
            if (cards) return cards;
            return await getDeckList(url);
        },
        name: async ({ url, name }) => {
            if (name) return name;
            return await getDeckListName(url);
        },
        deckType: async ({ url, name, deckType }) => {
            if (deckType) return deckType;
            if (name && name.includes('EDH Commander Deck')) {
                return 'Commander / EDH';
            }
            return await getDeckType(url);
        },
        commander: async ({ url, name, deckType, commander }) => {
            if (commander) return commander;
            if (name && name.includes('EDH Commander Deck')) {
                return {
                    name: name.split(' EDH Commander Deck')[0],
                };
            }
            if ((deckType || (await getDeckType(url))) !== 'Commander / EDH') {
                return null;
            }
            return (await getDeckList(url))[0];
        },
        description: async ({ url, description }) => {
            if (description) return description;
            return await getDeckDescription(url);
        },
    },
    Card: {
        scryfallApiData: async ({ name }) => {
            return await getScryfallApiData(name);
        },
    },
    User: {
        decks: async ({ user }) => {
            return await getDeckListsFromUser(user);
        },
    },
};
