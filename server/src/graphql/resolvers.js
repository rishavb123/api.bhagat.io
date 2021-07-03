import GraphQLJSON from 'graphql-type-json';
import FuzzySearch from 'fuzzy-search';
import mtgResolvers from './mtg/resolvers';
import githubResolvers from './github/resolvers';
import { getDeckListsFromUser } from '../modules/mtg/decks';
import { getMyRepositoriesWithBhagatTopic, numRequestsLeft } from '../modules/github';
import { wrapWithDbClient } from '../modules/db';
import { MOXFIELD_USER } from '../modules/mtg/constants';


const resolvers = {
    Query: {
        deck: (_, args) => ({
            url: args.url,
        }),
        card: (_, args) => ({
            name: args.name,
        }),
        mydeck: async (_, args) => {
            const searcher = new FuzzySearch((await getDeckListsFromUser(MOXFIELD_USER)), ['name'], { sort: true });
            const searchResults = searcher.search(args.name);
            if (searchResults.length > 0) {
                return searchResults[0];
            }
            return null;
        },
        mydecks: async () => {
            return await getDeckListsFromUser(MOXFIELD_USER);
        },
        user: (_, args) => ({
            user: args.user,
        }),

        repos: async (_, args) => {
            const reqRemaining = args.forceNoDb ? null : await numRequestsLeft();
            if (!args.forceNoDb && (reqRemaining.core < 15 || reqRemaining.search < 4)) {
                return await wrapWithDbClient(async (client) => {
                    const db = await client.db('bhagat-db');
                    const collection = await db.collection('gh-repos');
                    const cursor = await collection.find();
                    const docs = await cursor.toArray();
                    for (const doc of docs) {
                        doc.fromDB = true;
                    }
                    return docs;
                });
            }
            return await getMyRepositoriesWithBhagatTopic(args.page, args.pageSize);
        },
    },
    JSON: GraphQLJSON,
};

export default [
    resolvers,
    mtgResolvers,
    githubResolvers,
];
