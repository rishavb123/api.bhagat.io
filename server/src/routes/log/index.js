import { discordLog } from '../../modules/discord';
import { hashString, generatePassword, checkHash } from '../../modules/utils/encryption';
import { wrapWithDbClient } from "../../modules/db";
import { addRoute } from "../utils";

export default function (app) {
    addRoute('/log/register', app.post.bind(app), async (req, res) => {
        await wrapWithDbClient(async (client) => {
            const db = await client.db('bhagat-db');
            const collection = await db.collection('log-apps');

            const password = req.body.auth || generatePassword(10);
            const hash = hashString(password);
            const cursor = await collection.find({
                name: req.body.app
            }, {
                projection: {
                    "__id": 0,
                },
                limit: 1,
            });
            const docs = await cursor.toArray();
            if (docs.length < 1) {
                await collection.insertOne({
                    name: req.body.app,
                    password: hash,
                });
                await discordLog(req.body.app, `Registered app ${req.body.app}!`);
                res.json({
                    status: 0,
                    msg: `App ${req.body.app} registered!`,
                    auth: password,
                });
            } else {
                res.json({
                    status: 1,
                    msg: `App ${req.body.app} already exists`,
                });
            }
        });
    });

    addRoute('/log', app.post.bind(app), async (req, res) => {
        await wrapWithDbClient(async (client) => {
            const db = await client.db('bhagat-db');
            const collection = await db.collection('log-apps');

            const cursor = await collection.find({
                name: req.body.app
            }, {
                projection: {
                    "__id": 0,
                },
                limit: 1,
            });
            const docs = await cursor.toArray();
            if (docs.length < 1) {
                res.json({
                    status: 1,
                    msg: `App ${req.body.app} does not exist`,
                });
            } else {
                const doc = docs[0];
                if (checkHash(req.body.auth, doc.password)) {
                    await discordLog(req.body.app, req.body.message, req.body.state || {});
                    res.json({
                        status: 0,
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: `Authentication for app ${req.body.app} failed`,
                    });
                }
            }
        });
    });

    addRoute('/log/unregister', app.post.bind(app), async (req, res) => {
        await wrapWithDbClient(async (client) => {
            const db = await client.db('bhagat-db');
            const collection = await db.collection('log-apps');

            const cursor = await collection.find({
                name: req.body.app
            }, {
                projection: {
                    "__id": 0,
                },
                limit: 1,
            });
            const docs = await cursor.toArray();
            if (docs.length < 1) {
                res.json({
                    status: 1,
                    msg: `App ${req.body.app} does not exist`,
                });
            } else {
                const doc = docs[0];
                if (checkHash(req.body.auth, doc.password)) {
                    await discordLog(req.body.app, `Un-registering app ${req.body.app} . . .`);
                    await collection.deleteOne({
                        'name': req.body.app,
                    });
                    res.json({
                        status: 0,
                        msg: `App ${req.body.app} unregistered`
                    });
                } else {
                    res.json({
                        status: 1,
                        msg: `Authentication for app ${req.body.app} failed`,
                    });
                }
            }
        });
    });
}