import GraphQLJSON from 'graphql-type-json';
import mtgResolvers from './mtg/resolvers';
import githubResolvers from './github/resolvers';
import jobResolvers from './jobs/resolvers';

const resolvers = {
    JSON: GraphQLJSON,
};

export default [
    resolvers,
    mtgResolvers,
    githubResolvers,
    jobResolvers,
];
