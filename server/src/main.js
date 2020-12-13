import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { schema, resolvers } from './graphql';

import { PORT } from './constants.js';

const server = new ApolloServer({ typeDefs: schema, resolvers });
const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on locahost:${PORT}. GraphQL exposed at localhost:${PORT}/graphql`);
});