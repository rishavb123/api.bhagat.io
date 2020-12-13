import * as rp from 'request-promise';
import * as $ from 'cheerio';

export function getDeckList(url) {
    return rp(url)
        .then((html) => {
            const get_prop = (prop) => $(`.deck-list-entry > .deck-list-entry-${prop} > *`, html);
            const get_text = (el) => el.firstChild.data.trim();
            
            const counts = get_prop('count');
            const names = get_prop('name');

            const deckList = [];

            for (let i = 0; i < counts.length; i++) {
                deckList.push({
                    link: counts[i].attribs.href,
                    count: parseInt(get_text(counts[i])),
                    name: get_text(names[i])
                });                
            }
            return deckList;
        })
        .catch(console.log);
}

export function getStringDeckList(url) {
    return getDeckList(url).then((data) => data.map((el) => el.count + " " + el.name));
}