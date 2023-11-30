import { createJob, getJob, getJobs, getJobsByCompanyId } from './db/jobs.js';
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError("No company found with id " + id);
            }
            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError("No job found with id " + id);
            }
            return job;
        },
        jobs: () => getJobs(),
    },

    Mutation: {
        createJob: (_root, { title, description }) => {
            const companyId = "FjcJCHJALA4i"; //TODO Hardcoded id
            return createJob({ companyId, title, description });
        }
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

function notFoundError(message) {
    return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}