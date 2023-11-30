import { getJob, getJobs } from './db/jobs.js';
import {getCompany} from './db/companies.js'

export const resolvers = {
    Query: {
        job: (_root,{ id }) => getJob(id),
        jobs: () => getJobs(),
    },

    //Field resolvers
    Job: {
        date: (job) => { return job.createdAt.slice(0, '10') },
        company: (job) => {return getCompany(job.companyId)}
    }
};