import { useState } from 'react';
import blogService from '../services/blogs';

const CreateBlog = ({ blogs, setBlogs, setNotification, setIsSuccess }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      title.trim();
      author.trim();
      url.trim();

      const blog = await blogService.create({ title, author, url });

      setBlogs([...blogs, blog]);

      const notification = `a new blog ${title} by ${author} added`;
      setNotification(notification);
      setIsSuccess(true);

      setTitle('');
      setAuthor('');
      setUrl('');

      setTimeout(() => {
        setNotification(null);
        setIsSuccess(null);
      }, 5000);
    } catch (error) {
      if (error.response?.data?.error) {
        const errorMessages = error.response.data.error;
        const errorValues = Object.values(errorMessages);

        let notificationMessage = `Please correct the following errors: ${errorValues
          .map((msg) => `${msg}.`)
          .join(' ')}`;

        setNotification(notificationMessage);

        setIsSuccess(false);

        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 10000);
      }
    }
  };
  return (
    <>
      <form onSubmit={handleCreateBlog}>
        <div className='form-group'>
          <label htmlFor='title'>title: </label>
          <input
            type='text'
            name='Title'
            id='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='author'>author: </label>
          <input
            type='text'
            name='Author'
            id='author'
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='url'>url: </label>
          <input
            type='text'
            name='Url'
            id='url'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>

        <button type='submit'>create</button>
      </form>
    </>
  );
};

export default CreateBlog;
