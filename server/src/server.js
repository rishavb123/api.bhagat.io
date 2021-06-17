import express from 'express';
import cron from 'node-cron';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';

import { schema, resolvers } from './graphql';
import jobs from './crons';
import setupApp from './routes';


const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginInlineTrace()],
});
const app = express();
server.applyMiddleware({ app });

setupApp(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}. GraphQL exposed at http://localhost:${port}/graphql`);
});

for (const job of jobs) {
    if (job.disabled !== true) {
        cron.schedule(job.expression, job.task, job.options || {});
    }
}
