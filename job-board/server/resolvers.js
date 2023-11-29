import { getJobs } from './db/jobs.js';
import {getCompany} from './db/companies.js'

export const resolvers = {
    Query: {
        jobs: () => getJobs()
    },

    //Field resolvers
    Job: {
        date: (job) => { return job.createdAt.slice(0, '10') },
        company: (job) => {return getCompany(job.companyId)}
    }
};