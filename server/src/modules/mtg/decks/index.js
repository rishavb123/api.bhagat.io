import { getBrowser } from '../../scraping';
import cache from 'memory-cache';

async function getDeckListAndName(url, caching) {
    const deck = caching? cache.get(`deck-object-${url}`): null;
    if (!deck) {
        const site = url.replace('www.', '').replace('https://', '')
            .replace('http://', '').split('.com')[0].split('.net')[0];
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        let obj = { name: 'Not Found', cards: [] };
        switch (site) {
            case 'moxfield':
                const mType = await page.$eval(".badge", (el) => el.innerText);
                const mName = await page.$eval('.deckheader-name', (el) => el.innerText);
                const mCards = await page.$$eval('.deckview .table-deck-row', (elements) => {
                    const returnVal = [];
                    for (const el of elements) {
                        const nameLink = el.querySelector('.text-body');
                        returnVal.push({
                            link: nameLink.href,
                            count: parseInt(el.querySelector('.text-right').innerText),
                            name: nameLink.innerText,
                        });
                    }
                    return returnVal;
                });
                obj = { name: mName, cards: mCards, deckType: mType };
                break;
            case 'scryfall':
                const sType = await page.$eval(".deck-list-section-title", (el) => el.innerText);
                const sName = await page.$eval('h1', (el) => el.innerText);
                const sCards = await page.$$eval('.deck-list-entry', (elements) => {
                    const returnVal = [];
                    for (const el of elements) {
                        const nameLink = el.querySelector('.deck-list-entry-name a');
                        returnVal.push({
                            link: nameLink.href,
                            count: parseInt(el.querySelector('.deck-list-entry-count a').innerText),
                            name: nameLink.innerText,
                        });
                    }
                    return returnVal;
                });
                obj = { name: sName, cards: sCards };
                if (sType === "COMMANDER (1)") {
                    obj.deckType = "COMMANDER / EDH";
                }
                break;
        }
        if (caching) {
            cache.put(`deck-object-${url}`, obj, 60000);
        }
        page.close();
        return obj;
    }
    return deck;
}

export async function getDeckList(url, caching=true) {
    return (await getDeckListAndName(url, caching)).cards;
}

export async function getStringDeckList(url, caching=true) {
    return (await getDeckList(url, caching)).map((el) => el.count + ' ' + el.name);
}

export async function getDeckListName(url, caching=true) {
    return (await getDeckListAndName(url, caching)).name;
}

export async function getDeckType(url, caching=true) {
    return (await getDeckListAndName(url, caching)).deckType;
}

export async function getDeckListsFromUser(user, caching=true) {
    const decks = cache.get(`user-decks-${user}`);
    if (!decks) {
        const url = `https://www.moxfield.com/users/${user}`;
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const arr = await page.$$eval('.deckbox', (elements) => {
            const returnVal = [];
            for (const el of elements) {
                returnVal.push({
                    url: el.href,
                    name: el.querySelector('.deckbox-title').innerText,
                    deckType: el.querySelector('em').innerText
                });
            }
            return returnVal;
        });
        if (caching) {
            cache.put(`user-decks-${user}`, arr, 60000);
        }
        page.close();
        return arr;
    }
    return decks;
}
