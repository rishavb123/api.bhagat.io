import got from 'got';
import cheerio from 'cheerio';

export async function getDeckList(url) {
    const resp = await got(url);
    const html = resp.body;
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
