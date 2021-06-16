import { getBrowser } from '../../scraping';
import cache from 'memory-cache';

CACHING = false;

async function getDeckListAndName(url) {
    let deck = CACHING? cache.get(`deck-object-${url}`): null;
    if (!deck) {
        const site = url.replace('www.', '').replace('https://', '')
            .replace('http://', '').split('.com')[0].split('.net')[0];
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        let obj = { name: 'Not Found', cards: [] };
        switch (site) {
            case "moxfield":
                const mName = await page.$eval(".deckheader-name", (el) => el.innerText);
                const mCards = await page.$$eval(".deckview .table-deck-row", (elements) => {
                    const returnVal = [];
                    for (const el of elements) {
                        const nameLink = el.querySelector(".text-body");
                        returnVal.push({
                            link: nameLink.href,
                            count: parseInt(el.querySelector(".text-right").innerText),
                            name: nameLink.innerText,
                        });
                    }
                    return returnVal;
                });
                obj = { name: mName, cards: mCards };
                break;
            case "scryfall":
                const sName = await page.$eval("h1", (el) => el.innerText);
                const sCards = await page.$$eval(".deck-list-entry", (elements) => {
                    const returnVal = [];
                    for (const el of elements) {
                        const nameLink = el.querySelector(".deck-list-entry-name a");
                        returnVal.push({
                            link: nameLink.href,
                            count: parseInt(el.querySelector(".deck-list-entry-count a").innerText),
                            name: nameLink.innerText,
                        });
                    }
                    return returnVal;
                });
                obj = { name: sName, cards: sCards };
                break;
        }
        if(CACHING)
            cache.put(`deck-object-${url}`, obj, 60000);
        page.close();
        return obj;
    }
    return deck;
}

export async function getDeckList(url) {
    return (await getDeckListAndName(url)).cards;
}

export async function getStringDeckList(url) {
    return (await getDeckList(url)).map((el) => el.count + ' ' + el.name);
}

export async function getDeckListName(url) {
    return (await getDeckListAndName(url)).name;
}

export async function getDeckListsFromUser(user) {

}