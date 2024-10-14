// React-Router:
import { useNavigate } from 'react-router';
// React:
import { useState } from 'react';
// import { createJob } from '../lib/graphql/mutations';
// Hooks:
import { useCreateJob } from '../hooks';

function CreateJobPage() {
  // Routing:
  const navigate = useNavigate();
  // State:
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Mutation:
  const { loading, error, createJob } = useCreateJob();

  // Handlers:
  const handleSubmit = async (event) => {
    event.preventDefault();
    // // Sending the mutation request:
    const job = await createJob({ title: title.trim(), description });
    console.log('New job:', job);

    // Navigating to the created job page:
    if (job) {
      navigate(`/jobs/${job.id}`);
    }
  };

  // JSX:
  const errorBlock = error ? (
    <p className='has-text-danger'>
      {'There was an error, loading available jobs!'}
    </p>
  ) : null;

  return (
    <div>
      <h1 className='title'>New Job</h1>
      <div className='box'>
        {errorBlock}
        <form onSubmit={handleSubmit}>
          <div className='field'>
            <label className='label'>Title</label>
            <div className='control'>
              <input
                className='input'
                type='text'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Description</label>
            <div className='control'>
              <textarea
                className='textarea'
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className='field'>
            <div className='control'>
              <button
                className='button is-link'
                type='submit'
                disabled={loading || !title.trim()}
              >
                {loading ? 'Submitting' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
