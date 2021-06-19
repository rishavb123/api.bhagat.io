import { gql } from 'apollo-server-express';

import mtgSchema from './mtg/schema';
import githubSchema from './github/schema';

const schema = gql`
    scalar JSON
    type Query {
        deck(url: String): Deck!,
        card(name: String): Card!,
        mydeck(name: String): Deck,
        mydecks(name: String): [Deck!]!,
        user(user: String): User!,

        repos(page: Int=1, pageSize: Int=100): [Repo]!
    }
`;

const typeDefs = [
    schema,
    mtgSchema,
    githubSchema,
];

export default typeDefs;
