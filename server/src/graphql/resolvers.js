import mtgResolvers from './mtg/resolvers';

const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url
        })
    }
};

export default {
    ...resolvers,
    ...mtgResolvers
};