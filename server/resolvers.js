// GraphQL:
import { GraphQLError } from 'graphql';
// Database:
import {
  createJob,
  getJob,
  getJobs,
  getJobsByCompanyId,
  updateJob,
  deleteJob,
  countJobs,
} from './db/jobs.js';
import { getCompany } from './db/companies.js';

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw notFoundError({
          id,
          message: 'No company was found with the id:',
        });
      }

      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw notFoundError({ id, message: 'No job was found with the id: ' });
      }

      return job;
    },
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();

      return { items, totalCount };
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      // User authorization:
      if (!user) {
        throw unauthorizedError({
          message: 'You need to be logged in to perform this operation!',
        });
      }
      const { companyId } = user;

      return createJob({ companyId, title, description });
    },

    deleteJob: async (_root, { input: { id } }, { user }) => {
      // User authorization:
      if (!user) {
        throw unauthorizedError({
          message: 'You need to be logged in to perform this operation!',
        });
      }
      const { companyId } = user;

      const deletedJob = await deleteJob(id, companyId);

      if (!deletedJob) {
        throw notFoundError({
          id,
          message: 'No job from your company was found with the id: ',
        });
      }

      return deletedJob;
    },

    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      // User authorization:
      if (!user) {
        throw unauthorizedError({
          message: 'You need to be logged in to perform this operation!',
        });
      }
      const { companyId } = user;

      const updatedJob = await updateJob({ id, title, description, companyId });

      if (!updatedJob) {
        throw notFoundError({
          id,
          message: 'No job from your company was found with the id: ',
        });
      }

      return updatedJob;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
    // jobs: (company) =>
    //   getJobs().then((jobs) =>
    //     jobs.filter((job) => job.companyId === company.id)
    //   ),
  },

  Job: {
    // company: (job) => getCompany(job.companyId),
    company: (job, _args, { companiesLoader }) =>
      companiesLoader.load(job.companyId), // to load companies for all jobs in one query
    date: (job) => new Date(job.createdAt).toISOString().slice(0, 10),
  },
};

// ERRORS:
// NOT FOUND ERROR:
function notFoundError({ id, message }) {
  return new GraphQLError(`${message} '${id}'.`, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
}
// UNAUTHORIZED FOUND ERROR:
function unauthorizedError({ message }) {
  return new GraphQLError(`${message}.`, {
    extensions: {
      code: 'UNAUTHORIZED',
    },
  });
}
