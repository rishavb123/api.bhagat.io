import { makeExecutableSchema } from 'apollo-server-express';
import got from 'got';

import { port } from '../constants';
import { schema, resolvers } from '.';

const executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers
});

export async function queryGraphQL(query) {
    const resp = await got.post(`http://localhost:${port}/graphql`, {
        json: {
            query,
        },
        responseType: 'json',
    });

    return resp.body;
}
