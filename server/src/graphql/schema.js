import { gql } from 'apollo-server-express';

import mtgSchema from './mtg/schema';
import githubSchema from './github/schema';

// TODO: move all mtg schema and query stuff to mtg and same with github
// TODO: create a Me section with some of my basic information loaded in from
// - either linkedIn github or hard coded
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
