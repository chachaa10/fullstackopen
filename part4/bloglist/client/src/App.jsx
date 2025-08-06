import { useEffect, useRef, useState } from 'react';
import Blog from './components/Blog';
import CreateBlog from './components/CreateBlog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import ToggleVisible from './components/ToggleVisible';
import blogService from './services/blogs';
import './style.css';
import capitalizeWord from './utils/capitalizeWord';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const createBlogRef = useRef();

  const userKey = 'userBlogKey';

  const name = capitalizeWord(user?.name);

  const blogsToDisplay = blogs.toSorted((a, b) => b.likes - a.likes);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(userKey);
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  if (!user)
    return (
      <>
        <h2>Login to application</h2>

        {notification && <p className='error'>{notification}</p>}

        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setUser={setUser}
          setNotification={setNotification}
          userKey={userKey}
        />
      </>
    );

  const handleLogout = () => {
    window.localStorage.removeItem(userKey);
    setUser(null);
    setNotification(null);
    setIsSuccess(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setNotification('successfully delete blog');
        setIsSuccess(true);
      } catch (error) {
        setNotification(error?.response?.data?.error);
        setIsSuccess(false);
        setTimeout(() => {
          setNotification(null);
          setIsSuccess(null);
        }, 5000);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      const likedBlog = await blogService.likeBlog(id);
      setBlogs(
        blogs.map((blog) => (blog.id === likedBlog.id ? likedBlog : blog))
      );
    } catch (error) {
      setNotification(error?.response?.data?.error);
      setIsSuccess(false);
      setTimeout(() => {
        setNotification(null);
        setIsSuccess(null);
      }, 5000);
    }
  };

  return (
    <>
      <h2>blogs</h2>

      {notification && (
        <Notification isSuccess={isSuccess} notification={notification} />
      )}
      <p>
        {name} logged in {''}
        <button onClick={handleLogout}>logout</button>
      </p>

      <ToggleVisible buttonLabel='create blog' ref={createBlogRef}>
        <CreateBlog
          blogs={blogs}
          setBlogs={setBlogs}
          setIsSuccess={setIsSuccess}
          setNotification={setNotification}
          ref={createBlogRef}
        />
      </ToggleVisible>

      {blogsToDisplay.length === 0 ? (
        <p>No blog</p>
      ) : (
        blogsToDisplay.map((blog) => (
          <Blog
            user={user}
            key={blog.id}
            blog={blog}
            handleDelete={() => handleDelete(blog.id)}
            handleLike={() => handleLike(blog.id)}
          />
        ))
      )}
    </>
  );
};

export default App;
