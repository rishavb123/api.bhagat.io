import { getBrowser, $eval } from '../scraping';
import { wrapWithCache } from '../utils/caching';

export async function getDeckListInfo(url, caching) {
    return await wrapWithCache(async () => {
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
            const mDescription = await $eval(page, '.fw-light.mb-4',
                (el) => !el.classList.contains('d-flex') ? el.innerText : null);
            const mComment = await $eval(page, '.comment p', (el) => el ? el.innerText : null, false);
            const mCards = await page.$$eval('.deckview .table-deck-row', (elements) => {
                const returnVal = [];
                for (const el of elements) {
                    const nameLink = el.querySelector('.text-body');
                    const c = parseInt(el.querySelector('td.text-end').innerText);
                    returnVal.push({
                        link: nameLink.href,
                        count: c,
                        name: nameLink.innerText,
                    });
                }
                return returnVal;
            });
            let fullDesc = (mDescription ? mDescription : '') +
                ((!!mDescription && !!mComment) ? '; ' : '') +
                (mComment || '');
            if (fullDesc.length == 0) {
                fullDesc = null;
            }
            obj = { name: mName, cards: mCards, deckType: mType, description: fullDesc };
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
        page.close();
        return obj;
    }, `deck-object-${url}`, 120000, caching = caching);
}

export async function getDeckList(url, caching = true) {
    return (await getDeckListInfo(url, caching)).cards;
}

export async function getStringDeckList(url, caching = true) {
    return (await getDeckList(url, caching)).map((el) => el.count + ' ' + el.name);
}

export async function getDeckListName(url, caching = true) {
    return (await getDeckListInfo(url, caching)).name;
}

export async function getDeckType(url, caching = true) {
    return (await getDeckListInfo(url, caching)).deckType;
}

export async function getDeckDescription(url, caching = true) {
    return (await getDeckListInfo(url, caching)).description;
}

export async function getDeckListsFromUser(user, caching = true) {
    return await wrapWithCache(async () => {
        const url = `https://www.moxfield.com/users/${user}`;
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForFunction(async function loadAll() {
            const el = document.querySelector('.btn-secondary.btn-custom');
            if (el) {
                el.click();
                return new Promise(async (res, rej) => setTimeout(async () => res(await loadAll()), 500));
            }
            return 1;
        });
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
        page.close();
        return arr;
    }, `user-decks-${user}`, 120000, caching = caching);
}
