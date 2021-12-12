import { queryGraphQL } from '../../graphql/local';
import jobs from '../../jobs';

export default [
    {
        name: 'list_jobs',
        parseArgs: (_) => ({}),
        help: 'Lists all the jobs and information on them. Usage: !list-jobs',
        run: async (_) => {
            let reply = '';
            const keys = ['name', 'expression', 'disabled', 'runOnStart',
                'runInDev', 'currentlyRunning', 'lastExecuted'];
            const jobsGQL = (await queryGraphQL(`
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
            `)).data.jobs;
            for (const job of jobsGQL) {
                reply += `${job.name}(`;
                for (const key of keys) {
                    reply += `${key} = ${job[key]}, `;
                }
                reply = reply.substring(0, reply.length - 2);
                reply += ')\n';
            }
            return reply;
        },
    },
    {
        name: 'get_job',
        help: 'Gets the information on a specified job. Usage: !get-job {jobName}',
        parseArgs: (message) => ({ name: message }),
        run: async ({ name }) => {
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
                name: name,
            });
            if (result.errors) {
                return `Job ${name} not found.`;
            }
            const job = result.data.job;
            let reply = `${job.name}(`;
            const keys = ['name', 'expression', 'disabled', 'runOnStart',
                'runInDev', 'currentlyRunning', 'lastExecuted'];
            for (const key of keys) {
                reply += `\t${key} = ${job[key]}, \n`;
            }
            reply = reply.substring(0, reply.length - 3) + '\n)';
            return reply;
        },
    },
    {
        name: 'run_job',
        help: 'Runs the specified job. Usage: !run-job {jobName}. To run in the background use !run-job _{jobName}',
        parseArgs: (message) => {
            if (message.startsWith('_')) {
                return {
                    name: message.substring(1),
                    wait: false,
                };
            } else {
                return {
                    name: message,
                    wait: true,
                };
            }
        },
        run: async ({ name, wait }) => {
            const job = jobs.find((job) => job.name == name);
            if (job) {
                if (job.running) {
                    return 'Job is already running';
                } else if (wait) {
                    await job.call();
                    return 'Finished running job';
                } else {
                    job.call();
                    return 'Started job in the background';
                }
            } else {
                return 'Job not found. Run !list_jobs to list all jobs.';
            }
        },
    },

];
