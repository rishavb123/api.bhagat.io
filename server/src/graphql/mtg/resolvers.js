import FuzzySearch from 'fuzzy-search';

import {
    getDeckDescription,
    getDeckList,
    getDeckListName,
    getDeckListsFromUser,
    getDeckType,
} from '../../modules/mtg/decks';
import { getScryfallApiData } from '../../modules/mtg/cards';
import { MOXFIELD_USER } from '../../modules/mtg/constants';

export default {
    Deck: {
        cards: async ({ url, cards, caching }) => {
            if (cards) return cards;
            const result = await getDeckList(url);
            for (const r of result) {
                r.caching = caching;
            }
            return result;
        },
        name: async ({ url, name, caching }) => {
            if (name) return name;
            return await getDeckListName(url, caching);
        },
        deckType: async ({ url, name, deckType, caching }) => {
            if (deckType) return deckType;
            if (name && name.includes('EDH Commander Deck')) {
                return 'Commander / EDH';
            }
            return await getDeckType(url, caching);
        },
        commander: async ({ url, name, deckType, commander, caching }) => {
            if (commander) return commander;
            if (name && name.includes(' EDH Commander Deck')) {
                return {
                    name: name.split(' EDH Commander Deck')[0],
                    caching,
                };
            }
            if ((deckType || (await getDeckType(url))) !== 'Commander / EDH') {
                return null;
            }
            const result = (await getDeckList(url, args.caching))[0];
            result.caching = caching;
            return result;
        },
        description: async ({ url, description, caching }) => {
            if (description) return description;
            return await getDeckDescription(url, caching);
        },
    },
    Card: {
        scryfallApiData: async ({ name, caching }) => {
            return await getScryfallApiData(name, caching);
        },
    },
    MoxfieldUser: {
        decks: async ({ user, caching }) => {
            const result = await getDeckListsFromUser(user, caching);
            for (const r of result) {
                r.caching = caching;
            }
            return result;
        },
    },
    Query: {
        deck: (_, { url, caching=true }) => ({
            url,
            caching,
        }),
        card: (_, { name, caching=true }) => ({
            name,
            caching,
        }),
        mydeck: async (_, { name, caching=true }) => {
            const searcher = new FuzzySearch((await getDeckListsFromUser(MOXFIELD_USER, caching)), ['name'], { sort: true });
            const searchResults = searcher.search(name);
            if (searchResults.length > 0) {
                const result = searchResults[0];
                result.caching = caching;
                return result;
            }
            return null;
        },
        mydecks: async (_, { caching=true }) => {
            const result = await getDeckListsFromUser(MOXFIELD_USER, caching);
            for (const r of result) {
                r.caching = caching;
            }
            return result;
        },
        moxfielduser: (_, { user, caching=true }) => ({
            user,
            caching
        }),
    },
};
