import jobs from '../../crons';

export default function(app) {
    app.get('/jobs', (req, res) => {
        res.json({
            jobs: jobs.map((job) => ({
                name: job.name,
                expression: job.expression,
                disabled: job.disabled || false,
                runOnStart: job.runOnStart || false,
            })),
        });
    });

    app.get('/jobs/:jobName', (req, res) => {
        res.json({
            job: jobs.find((job) => job.name == req.params.jobName),
        });
    });

    app.get('/jobs/:jobName/run', async (req, res) => {
        const wait = req.query.wait || 'false';
        const job = jobs.find((job) => job.name == req.params.jobName);
        if (job) {
            if (wait.toLowerCase() === 'true') {
                await job.task();
                res.json({
                    status: 0,
                    msg: 'Finished running job',
                });
            } else {
                job.task();
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
