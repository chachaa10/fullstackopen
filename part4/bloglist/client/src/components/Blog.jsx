const Blog = ({ blog, handleDelete }) => {
  return (
    <p>
      {blog.title} by {blog.author}{' '}
      <button onClick={handleDelete}>delete</button>
    </p>
  );
};

export default Blog;
