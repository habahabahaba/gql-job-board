// GraphQL:
import { gql } from '@apollo/client';
import { apolloClient } from './client';

// const client = new GraphQLClient('http://localhost:9000/graphql');

// Will also be used in useQuery:
export const companyByIdQuery = /* GraphQL */ gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`;
export async function fetchCompanyById(id) {
  // const { company } = await client.request(query, { id });

  // With Apollo-Client:
  const result = await apolloClient.query({
    query: companyByIdQuery,
    variables: { id },
  });

  const {
    data: { company },
  } = result;

  return company;
}

// Will also be used in mutations:
export const jobDetailsFragment = gql`
  fragment JobDetails on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;
export const jobByIdQuery = /* GraphQL */ gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${jobDetailsFragment}
`;

export async function fetchJobById(id) {
  // const { job } = await client.request(query, { id });

  // With Apollo-Client:
  const result = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });

  const {
    data: { job },
  } = result;

  return job;
}

export const jobsQuery = /* GraphQL */ gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        date
        title
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export async function fetchJobs() {
  // const { jobs } = await client.request(query);

  // With Apollo-Client:
  const result = await apolloClient.query({
    query: jobsQuery,
    fetchPolicy: 'network-only',
  });

  const {
    data: { jobs },
  } = result;

  return jobs;
}
