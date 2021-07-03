import { graphql } from '../../node_modules/graphql';

import schema from '.';

export async function queryGraphQL(query, variables = {}) {
    console.log(variables);
    return await graphql({ schema, source: query, variableValues: variables });
}
