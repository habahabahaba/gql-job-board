// Apollo:
// import { useQuery } from '@apollo/client';
// Queries:
// import { companyByIdQuery } from '../lib/graphql/queries';
// import { fetchCompanyById } from '../lib/graphql/queries';
// React-Router:
import { useParams } from 'react-router';
// React:
// import { useState, useEffect } from 'react';
// Hooks:
import { useFetchCompanyById } from '../hooks';
// Components:
import JobList from '../components/JobList';

function CompanyPage() {
  // Routing:
  const { companyId: id } = useParams();

  // Fetching the company:
  const { loading, error, company } = useFetchCompanyById(id);

  // console.log('[companyPage] ', { loading, error, data });

  // // State:
  // const [state, setState] = useState({
  //   company: null,
  //   fetching: true,
  //   error: false,
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const fetchedCompany = await fetchCompanyById(id);
  //       setState(() => ({
  //         company: fetchedCompany,
  //         fetching: false,
  //         error: false,
  //       }));
  //     } catch (error) {
  //       setState(() => ({ company: null, fetching: false, error }));
  //     }
  //   })();
  // }, [id]);

  // JSX:
  return loading ? (
    <h2>Loading...</h2>
  ) : error ? (
    <p className='has-text-danger'>{'No such company was found!'}</p>
  ) : (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <h2 className='title is-5'> Jobs at {company.name}:</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
