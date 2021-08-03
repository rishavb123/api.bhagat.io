import express from 'express';
import cors from 'cors';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cron from 'node-cron';

import schema from './graphql';
import jobs from './jobs';
import addRoutes from './routes';
import { port } from './constants';

import { startDiscordBot } from './modules/discord';


// Express initialization
const app = express();
app.use(express.json());
app.use(cors());

// GraphQL Apollo Server initialization
const server = new ApolloServer({
    schema: schema,
    playground: true,
    introspection: true,
    plugins: [ApolloServerPluginInlineTrace()],
});
server.applyMiddleware({ app });

// Add all REST server routes
addRoutes(app);

// Start server
app.listen(port, () => {
    console.log(`Server up in ${process.env.NODE_ENV} environment`);
    console.log(`Server running on http://localhost:${port}. GraphQL exposed at http://localhost:${port}/graphql`);
});

// Setup all scheduled jobs
for (const job of jobs) {
    if (job.disabled !== true) {
        if (job.runOnStart) {
            job.call();
        }
        if (process.env.NODE_ENV !== 'development' || job.runInDev) {
            cron.schedule(job.expression, job.call, job.options || {});
        }
    }
}

// Starts the discord bot
startDiscordBot();
