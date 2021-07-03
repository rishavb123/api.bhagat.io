import { graphql } from '../../node_modules/graphql';

import schema from '.';

export function queryGraphQL(query) {
    return graphql(schema, query);
}
