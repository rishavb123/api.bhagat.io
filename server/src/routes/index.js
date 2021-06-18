import dbRoutes from './db';

export default function(app) {
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

    app.get('/wakeup', (req, res) => {
        res.send('Server is awake!');
    });

    dbRoutes(app);
}
