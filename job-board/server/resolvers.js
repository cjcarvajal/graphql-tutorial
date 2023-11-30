import { getJob, getJobs, getJobsByCompanyId } from './db/jobs.js';
import { getCompany } from './db/companies.js'

export const resolvers = {
    Query: {
        company: (_root, { id }) => getCompany(id),
        job: (_root, { id }) => getJob(id),
        jobs: () => getJobs(),
    },

    Company: {
        jobs: (company) => { return getJobsByCompanyId(company.id) }
    },
    //Field resolvers
    Job: {
        date: (job) => { return job.createdAt.slice(0, '10') },
        company: (job) => { return getCompany(job.companyId) }
    }
};