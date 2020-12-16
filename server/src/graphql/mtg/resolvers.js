import got from "got/dist/source";
import cache from 'memory-cache';
import { getDeckList } from "../../modules/mtg/decks";

export default {
    Deck: {
        cards: async (url) => {
            return await getDeckList(url);
        }
    },
    Card: {
        scryfallApiData: async ({ name }) => {
            let result = cache.get(`scryfall-card-data-${name}`);
            if (result)
                return result;
            result = JSON.parse((await got("https://api.scryfall.com/cards/named?exact=" + name)).body);
            cache.put(`scryfall-card-data-${name}`, result);
            return result;
        }
    }
};
