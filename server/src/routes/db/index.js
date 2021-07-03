import { wrapWithDbClient } from '../../modules/db';
import { addRoute } from '../utils';

export default function(app) {
    addRoute('/db', app.post.bind(app), async (req, res) => {
        const params = req.body;
        await wrapWithDbClient(async (client) => {
            const db = await client.db(params.db || 'bhagat-db');
            const collection = await db.collection(params.collection || 'mtg-edh-decks');
            const cursor = await collection.find(params.query || {}, params.options || {});
            const docs = await cursor.toArray();
            res.json({
                documents: docs,
                count: docs.length,
            });
        });
    });
}
