import got from 'got';
import cache from 'memory-cache';

import { USER, INFO_FILE_NAME, INFO_FILE_BRANCH } from './constants';

export async function getMyRepositoriesWithBhagatTopic(page, caching=true) {
    let result = caching? cache.get(`github-list-repos-${user}`): null;
    if (result) {
        return result;
    }
    result = JSON.parse((await got('https://api.github.com/search/repositories', {
        searchParams: {
            page: page,
            sort: 'updated',
            per_page: 50,
            q: `user:${USER} topic:bhagat-topic`,
        },
    })));
    if (caching) {
        cache.put(`github-list-repos-${user}`, 60000);
    }
    return result;
}

export async function getAdditionalInfo(repoName, caching=true) {
    let result = caching ? cache.get(`github-additional-info-${repoName}`) : null;
    if (result) {
        return result;
    }
    result = JSON.parse(await got(`https://raw.githubusercontent.com/${USER}/${repoName}/${INFO_FILE_BRANCH}/${INFO_FILE_NAME}`));
    if (caching) {
        cache.put(`github-additional-info-${repoName}`, 60000);
    }
    return result;
}

export async function getLanguages(languageUrl, caching=true) {
    let result = caching ? cache.get(`github-languages-${languageUrl}`) : null;
    if (result) {
        return result;
    }
    const resp = JSON.parse(await got(languageUrl));
    result = [];
    let sum = 0;
    for (const amount of resp) {
        sum += amount;
    }
    for (const lang in resp) {
        result.push({
            name: lang,
            percent: resp[lang] / sum,
        });
    }
    if (caching) {
        cache.put(`github-languages-${languageUrl}`, 60000);
    }
    return result;
}