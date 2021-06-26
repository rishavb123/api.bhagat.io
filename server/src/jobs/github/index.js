import { queryGraphQL } from '../../graphql/query';
import { wrapWithDbClient } from '../../modules/db';

export default [
    {
        name: 'read_repos',
        expression: '55 */2 * * *',
        task: async () => {
            const query = `
                query {
                    repos(forceNoDb: true) {
                        name
                        description
                        info {
                            links {
                                name
                                url
                            }
                            imageUrl
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
            const resp = await queryGraphQL(query);

            console.log('Read in data using Github API. Now pushing to MongoDB . . .');

            if (resp.data && resp.data.repos) {
                await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('gh-repos');

                    if ((await collection.countDocuments()) !== 0) {
                        await collection.drop();
                    }
                    await collection.insertMany(resp.data.repos);
                });
            }
        },
        runOnStart: false,
    },
];
