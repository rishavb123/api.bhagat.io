import express from 'express';
import cors from 'cors';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cron from 'node-cron';

import { schema, resolvers } from './graphql';
import jobs from './crons';
import addRoutes from './routes';


const app = express();
app.use(express.json());
app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginInlineTrace()],
});
server.applyMiddleware({ app });

addRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}. GraphQL exposed at http://localhost:${port}/graphql`);
});

for (const job of jobs) {
    if (job.disabled !== true) {
        if (job.runOnStart) {
            job.task();
        }
        if (process.env.NODE_ENV !== 'DEV' || job.runInDev) {
            cron.schedule(job.expression, job.task, job.options || {});
        }
    }
}
