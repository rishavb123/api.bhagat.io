import { queryGraphQL } from '../../graphql/local';
import jobs from '../../jobs';

export default function(app) {
    app.get('/jobs', (req, res) => {
        res.json(queryGraphQL(`
            jobs {
                name
                expression
                disabled
                runOnStart
                runInDev
                currentlyRunning
                lastExecuted
            }
        `));
    });

    app.get('/jobs/:jobName', (req, res) => {
        res.json(queryGraphQL(`
            job(name: $name) {
                name
                expression
                disabled
                runOnStart
                runInDev
                currentlyRunning
                lastExecuted
            }
        `), {
            name: req.params.jobName
        });
    });

    app.get('/jobs/:jobName/run', async (req, res) => {
        const wait = req.query.wait || 'false';
        const job = jobs.find((job) => job.name == req.params.jobName);
        if (job) {
            if (job.running) {
                res.json({
                    status: 1,
                    msg: 'Job is already running',
                });
            } else if (wait.toLowerCase() === 'true') {
                await job.call();
                res.json({
                    status: 0,
                    msg: 'Finished running job',
                });
            } else {
                job.call();
                res.json({
                    status: 0,
                    msg: 'Started job in the background',
                });
            }
        } else {
            res.json({
                status: 1,
                msg: 'Job not found. See /jobs to see all jobs. ',
            });
        }
    });
}
