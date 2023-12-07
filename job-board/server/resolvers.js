import { createJob, deleteJob, getJob, getJobs, getJobsByCompanyId, updateJob } from './db/jobs.js';
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
        createJob: (_root, { input: { title, description } }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }
            return createJob({ companyId: user.companyId, title, description });
        },

        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }

            const deletedJob = await deleteJob(id, user.companyId);

            if (!deletedJob) {
                throw notFoundError("No job found with id " + id);
            }
            return deletedJob;
        },

        updateJob: (_root, { input: { id, title, description } }) => {
            return updateJob({ id, title, description });
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

function unauthorizedError(message) {
    return new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
}