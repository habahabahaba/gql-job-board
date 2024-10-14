// Apollo:
import { useQuery, useMutation } from '@apollo/client';
// Queries:
import {
  companyByIdQuery,
  jobByIdQuery,
  jobsQuery,
} from '../lib/graphql/queries';
// Mutations:
import { createJobMutation } from '../lib/graphql/mutations';

// QUERIES HOOKS:
// Fetching a company:
export function useFetchCompanyById(id) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: {
      id,
    },
  });

  return { company: data?.company, loading, error: Boolean(error) };
}

// Fetching a job:
export function useFetchJobById(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: {
      id,
    },
  });
  //   console.log('[useFetchJobById] data: ', data);

  return { job: data?.job, loading, error: Boolean(error) };
}

// Fetching all jobs:
export function useFetchJobs(limit = 0, offset = 0) {
  const { data, loading, error } = useQuery(jobsQuery, {
    variables: { limit, offset },
    fetchPolicy: 'network-only',
  });
  //   console.log('[useFetchJobs] data: ', data);

  return {
    jobs: data?.jobs?.items || [],
    totalCount: data?.jobs?.totalCount || 0,
    loading,
    error: Boolean(error),
  };
}

// MUTATIONS HOOKS:
// Creating a new job:
export function useCreateJob() {
  const [mutate, result] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const { data } = await mutate({
      variables: { input: { title, description } },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    const { job } = data;

    return job;
  };

  const { loading, error } = result;

  return { loading, error: Boolean(error), createJob };
}
