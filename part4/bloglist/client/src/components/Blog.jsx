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

  const isSameAuthor = blog.user.username === user.username;
  const hideUnauthorized = { display: isSameAuthor ? '' : 'none' };

  const authorBlog = capitalizeWord(blog.author);

  return (
    <div style={blogStyle}>
      <p style={hideWhenView}>
        {blog.title} by {authorBlog} <button onClick={handleView}>view</button>
      </p>

      <div style={showWhenView}>
        <p>
          {blog.title} by {authorBlog}{' '}
          <button onClick={handleView}>hide</button>
        </p>

        <a href={blog.url}>{blog.url}</a>

        <p>
          likes {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{authorBlog}</p>
        <button style={hideUnauthorized} onClick={handleDelete}>
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
