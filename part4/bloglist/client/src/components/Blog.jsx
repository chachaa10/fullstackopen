import PropTypes from 'prop-types';
import { useState } from 'react';
import capitalizeWord from '../utils/capitalizeWord';

const Blog = ({ user, blog, handleDelete, handleLike }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleView = () => {
    setVisible(!visible);
  };

  const hideWhenView = { display: visible ? 'none' : '' };
  const showWhenView = { display: visible ? '' : 'none' };

  const isSameAuthor = blog.author === user.username;
  const hideUnauthorized = { display: isSameAuthor ? '' : 'none' };

  const authorBlog = capitalizeWord(blog.author);

  return (
    <div style={blogStyle} className='blog-item'>
      <p style={hideWhenView} className='blog-summary'>
        {blog.title} by {authorBlog}{' '}
        <button onClick={handleView} className='view-button'>
          view
        </button>
      </p>

      <div style={showWhenView} className='blog-details'>
        <p className='blog-title-author'>
          {blog.title} by {authorBlog}{' '}
          <button onClick={handleView} className='hide-button'>
            hide
          </button>
        </p>

        <a href={blog.url} className='blog-url'>
          {blog.url}
        </a>

        <p className='blog-likes'>
          likes {blog.likes}{' '}
          <button onClick={handleLike} className='like-button'>
            like
          </button>
        </p>
        <p className='blog-author-name'>{authorBlog}</p>
        <button
          style={hideUnauthorized}
          onClick={handleDelete}
          className='delete-button'
        >
          delete
        </button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleLike: PropTypes.func.isRequired,
};

export default Blog;
