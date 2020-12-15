import GraphQLJSON from 'graphql-type-json';
import mtgResolvers from './mtg/resolvers';

const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url
        })
    },
    JSON: GraphQLJSON
};

export default {
    ...resolvers,
    ...mtgResolvers
};