import { wrapFunctionality } from '../../modules/db';

export default function (app) {
    app.get('/db', async (req, res) => {
        const params = req.body;
        await wrapFunctionality(async (client) => {
            const db = await client.db(params.db || 'bhagat-db');
            const collection = await db.collection(params.collection || 'mtg-edh-decks');
            let cursor = await collection.find(params.query || {}, params.options || {});
            res.json({
                documents: cursor.toArray(),
            });
        });
    });
}