import { wrapWithDbClient } from "../db";

export async function addPerson(firstName, lastName, gtUser, discordUser='', discordId='') {
    return await wrapWithDbClient(async (client) => {
        const db = await client.db('gtmtg-db');
        const collection = await db.collection('users');
        const cursor = await collection.find({
            discord_id: discordId
        }, {});
        if ((await cursor.toArray()).length === 0) {
            await collection.insertOne({
                first: firstName,
                last: lastName,
                gt_user: gtUser,
                discord_user: discordUser,
                discord_id: discordId,
            });
            return true;
        }
        return false;
    });
}