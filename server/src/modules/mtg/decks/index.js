import got from 'got';
import cheerio from 'cheerio';
import cache from 'memory-cache';

async function getHtml(url, site) {
    let html = cache.get(`${site}-deck-html-${url}`);
    if (!html) {
        const resp = await got(url);
        html = resp.body;
        cache.put(`${site}-deck-html-${url}`, html, 60000);
    }
    return html;
}

// TODO: get moxfield working; right now cannot work because moxfield takes too long to load. Resp is the loading screen.

export async function getDeckList(url) {
    const site = url.replace("www.", "").replace("https://", "").replace("http://", "").split(".com")[0];
    const html = await getHtml(url, site);
    const $ = cheerio.load(html);

    const getProps = {
        scryfall: (prop) => $(`.deck-list-entry > .deck-list-entry-${prop} > *`),
        moxfield:  (prop) => {
            switch (prop) {
                case "count":
                    return $(`.table-deck-row > .text-right`);
                case "name":
                    return $(`.table-deck-row > td > a`);
                default:
                    return "";
            }
        }
    };

    const getProp = getProps[site];
    const getText = (el) => el.firstChild.data.trim();

    const counts = getProp('count');
    const names = getProp('name');
    console.log(counts.length, names.length, html);

    const deckList = [];

    for (let i = 0; i < counts.length; i++) {
        deckList.push({
            link: names[i].attribs.href,
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
