// Queries:
// import { fetchJobs } from '../lib/graphql/queries';
// React:
import { useState } from 'react';
// Hooks:
import { useFetchJobs } from '../hooks';
// Components:
import JobList from '../components/JobList';
import PaginationBar from '../components/PaginationBar';

const JOBS_PER_PAGE = 4;

function HomePage() {
  // State:
  // Pagination:
  const [currentPage, setCurrentPage] = useState(1);

  // Fetching jobs:
  const offset = (currentPage - 1) * JOBS_PER_PAGE;
  const { jobs, totalCount, loading, error } = useFetchJobs(
    JOBS_PER_PAGE,
    offset
  );
  const lastPage = Math.ceil(totalCount / JOBS_PER_PAGE);

  //   // State:
  //   const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     const fetchedJobs = await fetchJobs();
  //     setJobs(fetchedJobs);
  //   })();
  // }, []);

  // JSX:
  return loading ? (
    <h2>Loading available jobs...</h2>
  ) : error ? (
    <p className='has-text-danger'>
      {'There was an error, loading available jobs!'}
    </p>
  ) : (
    <div>
      <h1 className='title'>Job Board</h1>
      <PaginationBar
        currentPage={currentPage}
        totalPages={lastPage}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
