import GraphQLJSON from 'graphql-type-json';
import FuzzySearch from 'fuzzy-search';
import mtgResolvers from './mtg/resolvers';
import { getDeckListsFromUser } from '../modules/mtg/decks';


const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url,
        }),
        card: (_, args) => ({
            name: args.name,
        }),
        mydeck: async (_, args) => {
            const searcher = new FuzzySearch((await getDeckListsFromUser('rishavb123')), ['name'], { sort: true });
            const searchResults = searcher.search(args.name);
            if (searchResults.length > 0) {
                return searchResults[0];
            }
            return null;
        },
        mydecks: async () => {
            return await getDeckListsFromUser('rishavb123');
        },
        user: (_, args) => ({
            user: args.user,
        }),
    },
    JSON: GraphQLJSON,
};

export default {
    ...resolvers,
    ...mtgResolvers,
};
