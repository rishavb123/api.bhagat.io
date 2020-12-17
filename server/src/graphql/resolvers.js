import GraphQLJSON from 'graphql-type-json';
import FuzzySearch from 'fuzzy-search';
import mtgResolvers from './mtg/resolvers';

import { myDecks } from './mtg/constants';

const searcher = new FuzzySearch(myDecks, ['name'], { sort: true });

const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url
        }),
        card: (_, args) => ({
            name: args.name
        }),
        mydeck: (_, args) => {
            console.log(searcher.search(args.name));
            return searcher.search(args.name)[0];
        }
    },
    JSON: GraphQLJSON
};

export default {
    ...resolvers,
    ...mtgResolvers
};