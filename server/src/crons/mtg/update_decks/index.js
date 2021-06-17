import { MongoClient } from 'mongodb';
import { queryGraphQL } from '../../../graphql';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
    `@${process.env.MONGODB_CLUSTER}.vjvrg.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

export default [
    {
        expression: '*/10 * * * * *',
        task: async () => {
            
            console.log("hello");
        },
        disabled: false
    },
    {
        expression: '*/30 * * * * *',
        task: async () => {
            try {
                const client = new MongoClient(uri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                await client.connect();
                const db = await client.db('bhagat-db').collection('mtg-edh-decks');

                const cursor = await db.find();
                await cursor.forEach(console.log);

                const val = {
                    name: 'Golos, Tireless Pilgrim EDH Commander Deck - My Favorite',
                    commander: {
                        name: 'Golos, Tireless Pilgrim',
                        image_uri: 'https://c1.scryfall.com/file/scryfall-cards/png/front' +
                            '/ 1 / f / 1fa48620- 4c3d- 4f75-be1f - c12c4aa59f51.png ? 1592517637',
                    },
                    url: 'https://www.moxfield.com/decks/XMdFc9O33kG_QBtyC6bWNw2',
                    description: 'Blink and you will miss it!',
                };
                const filter = {
                    url: val.url,
                };

                await db.replaceOne(filter, val, {
                    upsert: true,
                });

                console.log('Connected successfully to server');
            } catch (e) {
                console.log(e);
            } finally {
                await client.close();
            }
        },
        disabled: true,
    },
];
