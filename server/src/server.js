import express from 'express';
import { ApolloServerPluginInlineTrace } from "apollo-server-core";
import { ApolloServer } from 'apollo-server-express';

import { schema, resolvers } from './graphql';

import { PORT } from './constants';

const server = new ApolloServer({ typeDefs: schema, resolvers, plugins: [ApolloServerPluginInlineTrace()] });
const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on https://locahost:${PORT}. GraphQL exposed at https://localhost:${PORT}/graphql`);
});
