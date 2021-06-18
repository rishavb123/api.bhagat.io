import jobs from '../../crons';

export default function (app) {
    app.get('/jobs', async (req, res) => {
        res.json({
            jobs: jobs.map((job) => ({
                name: job.name,
                expression: job.expression,
                disabled: job.disabled || false,
                runOnStart: job.runOnStart || false
            }))
        });
    });
}