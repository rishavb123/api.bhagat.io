import { queryGraphQL } from '../../graphql/local';
import { wrapWithDbClient } from '../../modules/db';
import { addHook } from '../../modules/github';
import { USER } from '../../modules/github/constants';

export default [
    {
        name: 'read_repos',
        expression: '55 */2 * * *',
        task: async () => {
            const query = `
                query readRepos($caching: Boolean!, $forceNoDb: Boolean!) {
                    repos(caching: $caching, forceNoDb: $forceNoDb) {
                        name
                        description
                        info {
                            links {
                                name
                                url
                            }
                            imageUrl
                            priority
                        }
                        languages {
                            name
                            percent
                        }
                        owner
                        createdDate
                        lastUpdated
                    }
                }
            `;
            const variables = {
                caching: false,
                forceNoDb: true,
            };
            const resp = await queryGraphQL(query, variables);
            console.log('Read in data using Github API.');

            if (resp.data && resp.data.repos && resp.data.repos.length > 0) {
                console.log('Adding discord webhooks to any github repositories that do not already have it . . .');
                for (const repo of resp.data.repos) {
                    await addHook({
                        'name': 'web',
                        'active': true,
                        'events': [
                            '*',
                        ],
                        'config': {
                            'url': process.env.GH_DISCORD_UPDATE_URL,
                            'content_type': 'json',
                        },
                    }, `https://api.github.com/repos/${USER}/${repo.name}/hooks`);
                }
                console.log('Pushing to MongoDB . . .');
                await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('gh-repos');

                    if ((await collection.countDocuments()) !== 0) {
                        await collection.drop();
                    }
                    await collection.insertMany(resp.data.repos);
                });
            } else {
                console.log('No data found. Not pushing to MongoDB');
            }
        },
        runOnStart: false,
    },
];
