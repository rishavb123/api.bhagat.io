import dbRoutes from './db';
import jobRoutes from './jobs';
import contactRoutes from './contact';
import logRoutes from './log';
import { addRoute } from './utils';

export default function(app) {
    addRoute('/', app.get.bind(app), (req, res) => {
        res.send('Hello World!');
    });

    addRoute('/usage', app.get.bind(app), (req, res) => {
        const memUsed = (process.memoryUsage().heapUsed +
        process.memoryUsage().rss + process.memoryUsage().external) / 1024 / 1024;
        res.json({
            status: 0,
            memory: `${memUsed} mb`,
        });
    });

    addRoute('/wakeup', app.get.bind(app), (req, res) => {
        res.send('Server is awake!');
    });

    dbRoutes(app);
    jobRoutes(app);
    contactRoutes(app);
    logRoutes(app);
}
