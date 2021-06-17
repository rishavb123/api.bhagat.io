import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema';
import resolvers from './resolvers';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export async function queryGraphQL(query) {
    return await graphql(schema, query);
}