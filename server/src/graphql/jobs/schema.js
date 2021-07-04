import { gql } from 'apollo-server-express';

export default gql`
    """The job type for any node-cron jobs run on my server instance"""
    type Job {
        """The name of the job"""
        name: String!,

        """The cron expression to indicate when the job is run"""
        expression: String!,

        """Whether the job is disabled or not"""
        disabled: Boolean!,

        """Whether the job runs on api startup or not"""
        runOnStart: Boolean!,

        """Whether the job runs in dev or not"""
        runInDev: Boolean!,

        """Whether the job is currently running"""
        currentlyRunning: Boolean!,

        """Date string for the last time the job was run"""
        lastExecuted: String,

        """toString of the function that is run"""
        task: String
    }

    type Query {
        """Get all the jobs on the api"""
        jobs: [Job]!,

        """Get a specific job by name"""
        job(
            """The name of the job"""
            name: String!
        ): Job!
    }
`;
