import GraphQLJSON from 'graphql-type-json';
import FuzzySearch from 'fuzzy-search';
import mtgResolvers from './mtg/resolvers';

import { myDecks } from './mtg/constants';

const searcher = new FuzzySearch(myDecks, ['searchTerm'], { sort: true });

const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url
        }),
        card: (_, args) => ({
            name: args.name
        }),
        mydeck: (_, args) => {
            const searchResults = searcher.search(args.name);
            if (searchResults.length > 0)
                return searchResults[0];
            return null;
        },
        mydecks: () => myDecks
    },
    JSON: GraphQLJSON
};

export default {
    ...resolvers,
    ...mtgResolvers
};