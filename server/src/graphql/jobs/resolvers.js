import jobs from '../../jobs';

export default {
    Job: {
        disabled: ({ disabled }) => disabled || false,
        runOnStart: ({ runOnStart }) => runOnStart || false,
        runInDev: ({ runInDev }) => runInDev || false,
        currentlyRunning: ({ running }) => running || false,
        task: ({ task }) => task.toString(),
    },
    Query: {
        jobs: () => jobs,
        job: (_, args) => jobs.find((job) => job.name == args.name),
    },
};
