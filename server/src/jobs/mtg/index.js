import { getScryfallApiData } from '../../modules/mtg/cards';
import { getDeckListInfo, getDeckListsFromUser } from '../../modules/mtg/decks';
import { wrapWithDbClient } from '../../modules/db';
import { MOXFIELD_USER } from '../../modules/mtg/constants';

export default [
    {
        name: 'update_decks',
        expression: '5 */2 * * *',
        task: async () => {
            const decks = await getDeckListsFromUser(MOXFIELD_USER, false);
            while (decks.length == 0) {
                await getDeckListsFromUser(MOXFIELD_USER, false);
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
                } else if (deck.deckType === 'Commander / EDH') {
                    deck.commander = {
                        name: moreInfo.cards[0].name,
                    };
                } else {
                    continue;
                }
                let data = await getScryfallApiData(deck.commander.name);
                deck.commander.color_identity = data.color_identity;
                deck.commander.mana_value = data.cmc;
                if (data.card_faces) {
                    let found = false;
                    for (const face of data.card_faces) {
                        if (face.name === deck.commander.name) {
                            data = face;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        data = data.card_faces[0];
                    }
                }
                deck.commander.image_url = data.image_uris.png;
                deck.commander.art_crop = data.image_uris.art_crop;
            }
            if (decks.length > 0) {
                console.log('Pushing decks to MongoDB . . .');
                await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('mtg-edh-decks');

                    if ((await collection.countDocuments()) !== 0) {
                        await collection.drop();
                    }
                    await collection.insertMany(decks);
                });
            } else {
                console.log('0 decks found! Not pushing to MongoDB');
            }
        },
        disabled: false,
    },
];