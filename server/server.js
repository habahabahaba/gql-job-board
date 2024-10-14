// 3rd party:
import cors from 'cors';
// Node.js:
import { readFile } from 'node:fs/promises';
// Express:
import express from 'express';
// Apollo:
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
// Authentication:
import { authMiddleware, handleLogin } from './auth.js';
// GraphQL:
import { resolvers } from './resolvers.js';
// Database:
import { getUser } from './db/users.js';
import { createCompaniesLoader } from './db/companies.js';

const PORT = 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

// GraphQL:
const typeDefs = await readFile('./schema.graphql', 'utf8');

// Apollo:
async function getContext({ req }) {
  // Batching and per-user-caching companies queries:
  const companiesLoader = createCompaniesLoader();
  const context = { companiesLoader };

  // Fetching companyId associated with the user:
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://${PORT}/graphql`);
});
