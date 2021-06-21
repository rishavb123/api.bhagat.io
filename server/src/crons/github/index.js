import { queryGraphQL } from '../../graphql/query';
import { wrapWithDbClient } from '../../modules/db';

export default [
    {
        name: 'read_repos',
        expression: '5 1-23/2 * * *',
        task: async () => {

            console.log('Starting read_repos task');

            const resp = await queryGraphQL(`
                query {
                    repos {
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
            `);

            console.log('Read in data using Github API. Now pushing to MongoDB . . .');

            if (resp.data && resp.data.repos) {
                await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('gh-repos');

                    if ((await collection.countDocuments()) !== 0) {
                        await collection.drop();
                    }
                    await collection.insertMany(resp.data.repos);

                    console.log('Repos inserted to MongoDB. Job finished!');
                });
            }
        },
        runOnStart: false,
    },
];
