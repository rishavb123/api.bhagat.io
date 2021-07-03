import { gql } from "apollo-server-express";

export default gql`
    type Job {
        name: String!,
        expression: String!,
        disabled: Boolean!,
        runOnStart: Boolean!,
        runInDev: Boolean!,
        currentlyRunning: Boolean!,
        lastExecuted: String,
        task: String
    }
    type Query {
        jobs: [Job]!,
        job(name: String): Job!
    }
`;