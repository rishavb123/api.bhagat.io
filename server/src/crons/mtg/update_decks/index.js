import { MongoClient } from 'mongodb';
import { getScryfallApiData } from '../../../modules/mtg/cards';
import { getDeckListInfo, getDeckListsFromUser } from '../../../modules/mtg/decks';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
    `@${process.env.MONGODB_CLUSTER}.vjvrg.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

export default [
    {
        expression: '40 * * * *',
        task: async () => {
            console.log("Starting update_decks task");
            const decks = await getDeckListsFromUser("rishavb123", false);
            while (decks.length == 0) {
                await getDeckListsFromUser("rishavb123", false);
            }
            console.log(`Read in ${decks.length} decks from moxfield`);
            for (const deck of decks) {
                const moreInfo = await getDeckListInfo(deck.url, false);
                deck.cards = moreInfo.cards;
                deck.description = moreInfo.description;
                if (deck.name.includes('EDH Commander Deck')) {
                    deck.commander = {
                        name: deck.name.split(' EDH Commander Deck')[0],
                    };
                }
                else if (deck.deckType === 'Commander / EDH') {
                    deck.commander = {
                        name: moreInfo.cards[0].name
                    };
                } else {
                    continue;
                }
                let data = await getScryfallApiData(deck.commander.name);
                if (data.card_faces) {
                    let found = false;
                    for (const face of data.card_faces) {
                        if (face.name === deck.commander.name) {
                            data = face;
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                    data = data.card_faces[0];
                }
                deck.commander.image_url = data.image_uris.png;
            }
            console.log('Pushing decks to MongoDB . . .');
            const client = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            try {
                await client.connect();
                const db = await client.db('bhagat-db');
                const collection = await db.collection('mtg-edh-decks');

                if ((await collection.countDocuments()) !== 0)
                    await collection.drop();
                await collection.insertMany(decks);

                console.log('Decks inserted to MongoDB');

            } catch (e) {
                console.log(e);
            } finally {
                await client.close();
            }

        },
        disabled: false
    }
];
