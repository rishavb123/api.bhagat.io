import { MongoClient } from 'mongodb';
import { uri } from './constants';

export function makeClient() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return client;
}

export async function wrapFunctionality(func) {
    const client = makeClient();
    let returnVal;
    try {
        await client.connect();
        returnVal = await func(client);
    } catch (e) {
        console.log(e);
    } finally {
        await client.close();
    }
    return returnVal;
}
