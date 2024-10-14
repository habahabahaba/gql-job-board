// GraphQL:
import { gql } from '@apollo/client';
import { apolloClient } from './client';
import { jobDetailsFragment, jobByIdQuery } from './queries';

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${jobDetailsFragment}
`;

export async function createJob({ title, description }) {
  //   const { job } = await client.request(mutation, {
  //     input: {
  //       title,
  //       description,
  //     },
  //   });

  // With Apollo-Client:
  const result = await apolloClient.mutate({
    mutation: createJobMutation,
    variables: { input: { title, description } },
    // Updating cache:
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  const {
    data: { job },
  } = result;

  return job;
}
