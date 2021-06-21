import got from 'got';
import { wrapWithCache } from '../utils/caching';

import { USER, INFO_FILE_NAME, INFO_FILE_BRANCH } from './constants';

export async function getMyRepositoriesWithBhagatTopic(page, pageSize, caching = true) {
    return await wrapWithCache(async () => {
        const resp = await got('https://api.github.com/search/repositories', {
            searchParams: {
                page: page,
                sort: 'updated',
                per_page: pageSize,
                q: `user:${USER} topic:bhagat-topic`,
            },
        });
        return JSON.parse(resp.body).items;
    }, `github-list-repos-${USER}-${page}-${pageSize}`, 120000, caching = caching);
}

export async function getAdditionalInfo(repoName, caching = true) {
    return await wrapWithCache(async () => {
        try {
            return JSON.parse(
                (await got(`https://raw.githubusercontent.com/${USER}/${repoName}/${INFO_FILE_BRANCH}/${INFO_FILE_NAME}`))
                    .body,
            );
        } catch (e) {
            return null;
        }
    }, `github-additional-info-${repoName}`, 120000, caching = caching);
}

export async function getLanguages(languageUrl, caching = true) {
    return await wrapWithCache(async () => {
        const resp = JSON.parse((await got(languageUrl)).body);
        const languages = [];
        let sum = 0;
        for (const amount of Object.values(resp)) {
            sum += amount;
        }
        for (const lang of Object.keys(resp)) {
            languages.push({
                name: lang,
                percent: resp[lang] / sum,
            });
        }
        return languages;
    }, `github-languages-${languageUrl}`, 120000, caching = caching);
}
