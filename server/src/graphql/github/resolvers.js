import { getAdditionalInfo, getCommits, getHooks, getLanguages } from '../../modules/github';
import { USER } from '../../modules/github/constants';
import { invalidDates, invalidMessagePatterns } from './constants';
import { getMyRepositoriesWithBhagatTopic, numRequestsLeft } from '../../modules/github';
import { wrapWithDbClient } from '../../modules/db';

export default {
    Repo: {
        owner: ({ owner, fromDB }) => {
            if (fromDB) {
                return owner;
            }
            return owner.login;
        },
        info: async ({ name, homepage, fromDB, info, caching }) => {
            if (fromDB) {
                return info;
            }
            const additionalInfo = await getAdditionalInfo(name, caching);
            return {
                ...additionalInfo,
                name,
                homepage,
                caching,
            };
        },
        createdDate: ({ created_at, fromDB, createdDate }) => {
            if (fromDB) {
                return createdDate;
            }
            return created_at;
        },
        lastUpdated: async ({ commits_url, updated_at, created_at, fromDB, lastUpdated, caching }) => {
            if (fromDB) {
                return lastUpdated;
            }
            const invalidateDate = (date) => {
                for (const invalidDate of invalidDates) {
                    if (
                        date.getDate() == invalidDate.day &&
                        date.getMonth() + 1 == invalidDate.month &&
                        date.getFullYear() == invalidDate.year
                    ) {
                        return true;
                    }
                }
                return false;
            };
            const invalidateMessage = (message) => {
                for (const invalidPattern of invalidMessagePatterns) {
                    if (message.match(invalidPattern)) {
                        return true;
                    }
                }
                return false;
            };
            const commits = await getCommits(commits_url.substring(0, commits_url.length - 6), caching);
            for (const commit of commits) {
                if (
                    !invalidateDate(new Date(commit.commit.committer.date)) &&
                    !invalidateMessage(commit.commit.message)
                ) {
                    return commit.commit.committer.date;
                }
            }
            const updateDate = new Date(updated_at);
            if (invalidate(updateDate)) {
                return updated_at;
            } else {
                return created_at;
            }
        },
        languages: async ({ languages_url, fromDB, languages, caching }) => {
            if (fromDB) {
                return languages;
            }
            return await getLanguages(languages_url, caching);
        },
        hooks: async ({ hooks_url, fromDB, hooks, caching }) => {
            if (fromDB) {
                return hooks
            }
            return await getHooks(hooks_url, caching);
        }
    },
    ExtraRepoInfo: {
        links: ({ name, links, ignoreSource, ignoreDownload, ignoreView, homepage, fromDB }) => {
            if (fromDB) {
                return links;
            }
            if (!links) {
                links = [];
            }
            const newLinks = [...links];
            let sourceExists = false;
            let downloadExists = false;
            let viewExists = false;
            for (const link of links) {
                if (link.name.toLowerCase() === 'source') {
                    sourceExists = true;
                }
                if (link.name.toLowerCase() === 'download') {
                    downloadExists = true;
                }
                if (link.name.toLowerCase() === 'view') {
                    viewExists = true;
                }
            }
            if (!ignoreView && !viewExists && homepage) {
                newLinks.push({
                    name: 'View',
                    url: homepage,
                });
            }
            if (!ignoreSource && !sourceExists) {
                newLinks.push({
                    name: 'Source',
                    url: `https://github.com/${USER}/${name}`,
                });
            }
            if (!ignoreDownload && !downloadExists) {
                newLinks.push({
                    name: 'Download',
                    url: `https://github.com/${USER}/${name}/archive/refs/heads/master.zip`,
                });
            }
            return newLinks;
        },
        priority: ({ priority }) => {
            return priority || 0;
        },
    },
    Query: {
        repos: async (_, { page=1, pageSize=100, forceNoDb=false, caching=true }) => {
            const reqRemaining = forceNoDb ? null : await numRequestsLeft();
            if (!forceNoDb && (reqRemaining.core < 15 || reqRemaining.search < 4)) {
                return await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('gh-repos');
                    const cursor = await collection.find();
                    const docs = await cursor.toArray();
                    for (const doc of docs) {
                        doc.fromDB = true;
                    }
                    return docs;
                });
            }
            const result = await getMyRepositoriesWithBhagatTopic(page, pageSize, caching);
            result.caching = caching;
            return result;
        },
    },
};
