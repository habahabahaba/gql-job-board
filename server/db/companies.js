// 3rd party:
import DataLoader from 'dataloader';
// Database:
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

// For batching and caching companies queries:
export function createCompaniesLoader() {
  return new DataLoader(async (ids) => {
    const companies = await getCompanyTable().select().whereIn('id', ids);

    return ids.map((id) => companies.find((company) => company.id === id));
  });
}
