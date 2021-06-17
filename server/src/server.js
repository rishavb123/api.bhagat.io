import express from 'express';
import cron from 'node-cron';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

import { schema, resolvers } from './graphql';
import jobs from './crons';


const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginInlineTrace()],
});
const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/usage', (req, res) => {
    const memUsed = (process.memoryUsage().heapUsed +
        process.memoryUsage().rss + process.memoryUsage().external) / 1024 / 1024;
    res.json({
        memory: `${memUsed} mb`,
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}. GraphQL exposed at http://localhost:${port}/graphql`);
});

for (const job of jobs) {
    cron.schedule(job.expression, job.task, job.options);
}
