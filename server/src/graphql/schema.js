import { gql } from "apollo-server-express";

import mtgSchema from './mtg/schema';

const schema = gql`
    type Query {
        deck: Deck
    }
`;

const typeDefs = [
    schema,
    mtgSchema
];

export default typeDefs;