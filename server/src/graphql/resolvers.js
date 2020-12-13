import { gql } from "apollo-server-express";

import mtgResolvers from './mtg/resolvers';

const resolvers = {
    Query: {
        deck: mtgResolvers.Deck
    }
}

export default resolvers;