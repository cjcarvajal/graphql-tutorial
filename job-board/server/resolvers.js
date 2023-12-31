import { createJob, deleteJob, getJob, getJobs, getJobsByCompanyId, getJobsCount, updateJob } from './db/jobs.js';
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
        jobs: (_root, { limit, offset }) => {
            const items = getJobs(limit, offset);
            const count = getJobsCount();
            return { items, count };
        },
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

        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw new unauthorizedError('Missing authentication');
            }

            const companyId = user.companyId;

            const updatedJob = await updateJob({ id, title, description, companyId });

            if (!updatedJob) {
                throw notFoundError("No job found with id " + id);
            }

            return updatedJob;
        }
    },

    Company: {
        jobs: (company) => { return getJobsByCompanyId(company.id) }
    },
    //Field resolvers
    Job: {
        date: (job) => { return job.createdAt.slice(0, '10') },
        company: (job, _args, { companyDataLoader }) => { return companyDataLoader.load(job.companyId) }
    }
};

function notFoundError(message) {
    return new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
}

function unauthorizedError(message) {
    return new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
}