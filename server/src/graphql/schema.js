import { gql } from 'apollo-server-express';

import mtgSchema from './mtg/schema';
import githubSchema from './github/schema';
import jobSchema from './jobs/schema';

// TODO: create a Me section with some of my basic information loaded in from
// - either linkedIn github or hard coded
const schema = gql`
    scalar JSON
`;

const typeDefs = [
    schema,
    mtgSchema,
    githubSchema,
    jobSchema,
];

export default typeDefs;
