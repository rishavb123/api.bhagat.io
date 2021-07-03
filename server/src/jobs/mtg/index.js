import { wrapWithDbClient } from '../../modules/db';
import { queryGraphQL } from '../../graphql/local';

export default [
    {
        name: 'update_decks',
        expression: '5 */2 * * *',
        task: async () => {
            const query = `
                query getDecks {
                    mydecks {
                        url
                        name
                        deckType
                        cards {
                            name
                            count
                            link
                        }
                        description
                        commander {
                            name
                            scryfallApiData
                        }
                    }
                }
            `;
            const result = await queryGraphQL(query);
            if (!result.errors) {
                const decks = result.data.mydecks;
                console.log(`Read in ${decks.length} decks from moxfield. Processing data . . .`);
                for (const deck of decks) {
                    let data = deck.commander.scryfallApiData;
                    deck.commander = {
                        name: deck.commander.name,
                    };
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
                throw new Error(result.errors[0].message);
            }
        },
    }
];
