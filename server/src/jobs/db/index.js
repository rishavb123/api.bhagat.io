import { wrapWithDbClient } from '../../modules/db';
import { uploadJSONFile } from '../../modules/github';

export default [
    {
        name: 'backup_db',
        expression: '5 0 * * *',
        task: async () => {
            const backupParams = [
                {
                    db: 'bhagat-db',
                    collection: 'timeline-events',
                    options: {
                        sort: {
                            'startDate.stamp': -1,
                        },
                        projection: {
                            _id: 0,
                            startDate: 1,
                            endDate: 1,
                            name: 1,
                            description: 1,
                            media: 1,
                        },
                    },
                    backupName: 'timeline',
                },
                {
                    db: 'bhagat-db',
                    collection: 'mtg-edh-decks',
                    query: {
                        'deckType': 'Commander / EDH',
                    },
                    options: {
                        sort: {
                            name: 1,
                        },
                        projection: {
                            _id: 0,
                            name: 1,
                            url: 1,
                            commander: 1,
                            description: 1,
                        },
                    },
                    backupName: 'mtg',
                },
                {
                    db: 'bhagat-db',
                    collection: 'personal-data',
                    query: {
                        name: 'resume-embed-link',
                    },
                    options: {
                        projection: {
                            _id: 0,
                            name: 0,
                        },
                    },
                    backupName: 'resume',
                },
                {
                    db: 'bhagat-db',
                    collection: 'gh-repos',
                    options: {
                        sort: [
                            ['info.priority', -1],
                            ['lastUpdated', -1],
                        ],
                        projection: {
                            '_id': 0,
                            'name': 1,
                            'description': 1,
                            'languages': 1,
                            'info.links': 1,
                            'info.imageUrl': 1,
                            'createdDate': 1,
                            'lastUpdated': 1,
                        },
                    },
                    backupName: 'repos',
                },
            ];

            const dbBackup = await wrapWithDbClient(async (client) => {
                const backup = {};
                for (const params of backupParams) {
                    const db = await client.db(params.db || 'bhagat-db');
                    const collection = await db.collection(params.collection || 'mtg-edh-decks');
                    const cursor = await collection.find(params.query || {}, params.options || {});
                    const docs = await cursor.toArray();
                    const data = {
                        documents: docs,
                        count: docs.length,
                    };
                    backup[params.backupName] = data;
                }
                return backup;
            });

            await uploadJSONFile(
                dbBackup, 'bhagat-db-backup', 'website_backup.json', 'backing up database for website',
            );
        },
        disabled: true,
        runOnStart: false,
    },
];
