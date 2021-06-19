import got from 'got';
import cache from 'memory-cache';

export async function getMyRepositoriesWithBhagatTopic(page, caching = true) {
    const user = "rishavb123"
    let result = cache.get(`github-list-repos-${user}`);
    if (result) {
        return result;
    }
    result = JSON.parse((await got('https://api.github.com/search/repositories', {
        searchParams: {
            page: page,
            sort: 'updated',
            per_page: 50,
            q: 'user:rishavb123 topic:bhagat-topic',
        },
    })));
    if (caching) {
        cache.put(`github-list-repos-${user}`);
    }
    return result;
}