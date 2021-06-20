import got from 'got';
import cache from 'memory-cache';

import { USER, INFO_FILE_NAME, INFO_FILE_BRANCH } from './constants';

export async function getMyRepositoriesWithBhagatTopic(page, pageSize, caching=true) {
    let result = caching? cache.get(`github-list-repos-${USER}-${page}-${pageSize}`): null;
    if (result) {
        return result;
    }
    const resp = await got('https://api.github.com/search/repositories', {
        searchParams: {
            page: page,
            sort: 'updated',
            per_page: pageSize,
            q: `user:${USER} topic:bhagat-topic`,
        },
    });
    result = JSON.parse(resp.body).items;
    if (caching) {
        cache.put(`github-list-repos-${USER}-${page}-${pageSize}`, result, 60000);
    }
    return result;
}

export async function getAdditionalInfo(repoName, caching=true) {
    let result = caching ? cache.get(`github-additional-info-${repoName}`) : null;
    if (result) {
        return result;
    }
    try {
        result = JSON.parse(
            (await got(`https://raw.githubusercontent.com/${USER}/${repoName}/${INFO_FILE_BRANCH}/${INFO_FILE_NAME}`))
                .body,
        );
    } catch (e) {
        return null;
    }
    if (caching) {
        cache.put(`github-additional-info-${repoName}`, result, 60000);
    }
    return result;
}

export async function getLanguages(languageUrl, caching=true) {
    let result = caching ? cache.get(`github-languages-${languageUrl}`) : null;
    if (result) {
        return result;
    }
    const resp = JSON.parse((await got(languageUrl)).body);
    result = [];
    let sum = 0;
    for (const amount of Object.values(resp)) {
        sum += amount;
    }
    for (const lang of Object.keys(resp)) {
        result.push({
            name: lang,
            percent: resp[lang] / sum,
        });
    }
    if (caching) {
        cache.put(`github-languages-${languageUrl}`, result, 60000);
    }
    return result;
}
