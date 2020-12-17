import { gql } from 'apollo-server-express';

import mtgSchema from './mtg/schema';

const schema = gql`
    scalar JSON
    type Query {
        deck(url: String): Deck!,
        card(name: String): Card!,
        mydeck(name: String): Deck,
        mydecks(name: String): [Deck!]!
    }
`;

const typeDefs = [
    schema,
    mtgSchema,
];

export default typeDefs;
