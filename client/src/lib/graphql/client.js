// 3rd party:
// GraphQL:
import { GraphQLClient } from 'graphql-request';
// Apollo:
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  concat,
  InMemoryCache,
} from '@apollo/client';

// Authentication:
import { getAccessToken } from '../auth';

const GQL_URL = 'http://localhost:9000/graphql';

const client = new GraphQLClient(
  GQL_URL,
  // User authorization:
  {
    headers: () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        return { Authorization: `Bearer ${accessToken}` };
      }
      return {};
    },
  }
);

export default client;

// Apollo client:
const httpLink = createHttpLink({ uri: GQL_URL });

// Authentication:
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  //   console.log(('[authLink] operation: ', operation));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      // fetchPolicy: 'network-only',
    },
    watchQuery: {
      // For React hooks.
      // fetchPolicy:'network-only'
    },
  },
});
