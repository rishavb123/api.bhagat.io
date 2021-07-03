import mtgCrons from './mtg';
import githubCrons from './github';

function processJobs(jobs) {
    for (const job of jobs) {
        job.running = false;
        job.call = async () => {
            if (job.running) {
                console.log(`Job ${job.name} is already running`);
            }
            console.log(`Starting ${job.name} job`);
            job.running = true;
            try {
                await job.task();
                console.log(`Finished ${job.name} job`);
            } catch (e) {
                console.log(`Error occured in ${job.name} job`, e.message);
            } finally {
                job.lastExecuted = new Date().toString();
                job.running = false;
            }
        };
    }
    return jobs;
}

export default processJobs([
    {
        name: 'hello_world',
        expression: '* * * * *',
        task: async () => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await delay(5000);
            console.log('Good Morning!');
        },
        disabled: true,
        runInDev: false,
    },
    ...mtgCrons,
    ...githubCrons,
]);
