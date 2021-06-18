import { getBrowser, $eval } from '../scraping';
import cache from 'memory-cache';

export async function getDeckListInfo(url, caching) {
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
            const mName = await $eval(page, '.deckheader-name', (el) => el.innerText);
            const mType = await $eval(page, '.badge', (el) => el.innerText);
            const mDescription = await $eval(page, '.font-weight-light',
                (el) => !el.classList.contains('d-flex') ? el.innerText : null);
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
            obj = { name: mName, cards: mCards, deckType: mType, description: mDescription };
            break;
        case 'scryfall':
            const sName = await $eval(page, 'h1', (el) => el.innerText);
            const sType = await $eval(page, '.deck-list-section-title', (el) => el.innerText);
            const sDescriptionEl = await page.$('.deck-details-description');
            const sDescription = sDescriptionEl? await page.evaluate((el) => el.innerText, sDescriptionEl): null;
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
            obj = { name: sName, cards: sCards, description: sDescription };
            if (sType === 'COMMANDER (1)') {
                obj.deckType = 'COMMANDER / EDH';
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
    return (await getDeckListInfo(url, caching)).cards;
}

export async function getStringDeckList(url, caching=true) {
    return (await getDeckList(url, caching)).map((el) => el.count + ' ' + el.name);
}

export async function getDeckListName(url, caching=true) {
    return (await getDeckListInfo(url, caching)).name;
}

export async function getDeckType(url, caching=true) {
    return (await getDeckListInfo(url, caching)).deckType;
}

export async function getDeckDescription(url, caching = true) {
    return (await getDeckListInfo(url, caching)).description;
}

// TODO: only getting the top 12 decks since there is a load more button
export async function getDeckListsFromUser(user, caching=true) {
    const decks = caching? cache.get(`user-decks-${user}`): null;
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
                    deckType: el.querySelector('em').innerText,
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
