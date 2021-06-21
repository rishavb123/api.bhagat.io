import got from 'got';

import { port } from '../constants';

export async function queryGraphQL(query) {
    const resp = await got.post(`http://localhost:${port}/graphql`, {
        json: {
            query,
        },
        responseType: 'json',
    });

    return resp.body;
}
