import { queryGraphQL } from '../../graphql/local';
import jobs from '../../jobs';
import { addRoute } from '../utils';


export default function(app) {
    addRoute('/jobs', app.get.bind(app), async (req, res) => {
        res.json({
            ...(await queryGraphQL(`
                query getJobs {
                    jobs {
                        name
                        expression
                        disabled
                        runOnStart
                        runInDev
                        currentlyRunning
                        lastExecuted
                    }
                }
            `)).data,
            status: 0,
        });
    });

    addRoute('/jobs/:jobName', app.get.bind(app), async (req, res) => {
        const result = await queryGraphQL(`
            query getJob ($name: String!){
                job(name: $name) {
                    name
                    expression
                    disabled
                    runOnStart
                    runInDev
                    currentlyRunning
                    lastExecuted
                }
            }
            `, {
            name: req.params.jobName,
        });
        if (result.errors) {
            const err = new Error('Invalid job name');
            err.name = 'InvalidInput';
            throw err;
        }
        res.json({
            ...result.data,
            status: 0,
        });
    });

    addRoute('/jobs/:jobName/run', app.get.bind(app), async (req, res) => {
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
