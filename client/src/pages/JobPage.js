// Utils:
import { formatDate } from '../lib/formatters';
// Queries:
// import { fetchJobById } from '../lib/graphql/queries';
// React-Router:
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
// React:
// import { useState, useEffect } from 'react';
// Hooks:
import { useFetchJobById } from '../hooks';

export default function JobPage() {
  // Routing:
  const { jobId: id } = useParams();
  // const job = useLoaderData();

  // Fetching a job:
  const { loading, error, job } = useFetchJobById(id);

  // // State:
  // const [state, setState] = useState({
  //   job: null,
  //   fetching: true,
  //   error: false,
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const fetchedJob = await fetchJobById(id);
  //       setState(() => ({
  //         job: fetchedJob,
  //         fetching: false,
  //         error: false,
  //       }));
  //     } catch (error) {
  //       setState(() => ({ job: null, fetching: false, error }));
  //     }
  //   })();
  // }, [id]);

  // const job = jobs.find((job) => job.id === jobId);

  // JSX:
  return loading ? (
    <h2>Loading...</h2>
  ) : error ? (
    <p className='has-text-danger'>{'No such job was found!'}</p>
  ) : (
    <div>
      <h1 className='title is-2'>{job.title}</h1>
      <h2 className='subtitle is-4'>
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className='box'>
        <div className='block has-text-grey'>
          Posted: {formatDate(job.date, 'long')}
        </div>
        <p className='block'>{job.description}</p>
      </div>
    </div>
  );
}

// export async function jobPageLoader({ params: { jobId } }) {
//   const fetchedJob = await fetchJobById(jobId);
//   return fetchedJob;
// }
