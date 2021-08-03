import got from 'got/dist/source';
import { wrapWithCache } from '../utils/caching';
import { delay } from '../utils/misc';

export async function getScryfallApiData(name, caching = true) {
    return await wrapWithCache(async () => {
        await delay(100);
        return JSON.parse((await got('https://api.scryfall.com/cards/named?exact=' + name)).body);
    }, `scryfall-card-data-${name}`, 60000, caching = caching);
}
