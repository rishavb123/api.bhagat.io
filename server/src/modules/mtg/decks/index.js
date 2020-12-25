import got from 'got';
import cheerio from 'cheerio';
import cache from 'memory-cache';

async function getHtml(url) {
    let html = cache.get(`scryfall-deck-html-${url}`);
    if (!html) {
        const resp = await got(url);
        html = resp.body;
        cache.put(`scryfall-deck-html-${url}`, html, 60000);
    }
    return html;
}

export async function getDeckList(url) {
    const html = await getHtml(url);
    const $ = cheerio.load(html);

    const getProp = (prop) => $(`.deck-list-entry > .deck-list-entry-${prop} > *`);
    const getText = (el) => el.firstChild.data.trim();

    const counts = getProp('count');
    const names = getProp('name');

    const deckList = [];

    for (let i = 0; i < counts.length; i++) {
        deckList.push({
            link: counts[i].attribs.href,
            count: parseInt(getText(counts[i])),
            name: getText(names[i]),
        });
    }
    return deckList;
}

export async function getStringDeckList(url) {
    return (await getDeckList(url)).map((el) => el.count + ' ' + el.name);
}

export async function getDeckListName(url) {
    const html = await getHtml(url);
    const $ = cheerio.load(html);

    return $('h1')[0].firstChild.data;
}
