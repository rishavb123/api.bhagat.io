import got from 'got/dist/source';
import cache from 'memory-cache';

export async function getScryfallApiData(name, caching=true) {
    let result = cache.get(`scryfall-card-data-${name}`);
    if (result) {
        return result;
    }
    result = JSON.parse((await got('https://api.scryfall.com/cards/named?exact=' + name)).body);
    if (caching) {
        cache.put(`scryfall-card-data-${name}`, result, 10000);
    }
    return result;
}
