import { getAdditionalInfo, getLanguages } from '../../modules/github';
import { USER } from '../../modules/github/constants';

export default {
    Repo: {
        owner: ({ owner }) => {
            return owner.login;
        },
        info: async ({ name }) => {
            const info = await getAdditionalInfo(name);
            return {
                ...info,
                name,
            };
        },
        createdDate: ({ created_at }) => {
            return created_at;
        },
        lastUpdated: ({ updated_at }) => {
            return updated_at;
        },
        languages: async ({ languages_url }) => {
            return await getLanguages(languages_url);
        },
    },
    ExtraRepoInfo: {
        links: ({ name, links, ignoreSource, ignoreDownload }) => {
            if (!links)
                links = [];
            const newLinks = [...links];
            let sourceExists = false;
            let downloadExists = false;
            for (const link of links) {
                if (link.name.toLowerCase() === 'source') {
                    sourceExists = true;
                }
                if (link.name.toLowerCase() === 'download') {
                    downloadExists = true;
                }
            }
            if (!ignoreSource && !sourceExists) {
                newLinks.push({
                    name: 'Source',
                    url: `https://github.com/${USER}/${name},`,
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
    },
};
