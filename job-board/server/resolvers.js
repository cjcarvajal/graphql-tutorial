import { getJobs } from './db/jobs.js';

export const resolvers = {
    Query: {
        jobs: () => getJobs()
    },

    //Field resolvers
    Job: {
        date: (job) => { return job.createdAt.slice(0, '10') }
    }
};