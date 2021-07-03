import { graphql } from '../../node_modules/graphql';

import schema from '.';

export async function queryGraphQL(query, variables = {}) {
    return await graphql({ schema, source: query, variableValues: variables });
}
