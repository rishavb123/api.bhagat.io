import { MongoClient } from "mongodb";
import { uri } from './constants';

export function makeClient() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return client;
}

export async function wrapFunctionality(func) {
    const client = makeClient();
    try {
        await client.connect();
        await func(client);
    } catch (e) {
        console.log(e);
    } finally {
        await client.close()
    }
}