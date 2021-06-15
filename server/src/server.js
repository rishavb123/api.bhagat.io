import express from 'express';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

import { schema, resolvers } from './graphql';

import { PORT } from './constants';

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginInlineTrace()]
});
const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || PORT;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}. GraphQL exposed at http://localhost:${port}/graphql`);
});
