import { useEffect, useState } from 'react';
import Blog from './components/Blog';
import CreateBlog from './components/CreateBlog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import './style.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const userKey = 'userBlogKey';

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

  const capitalizeName =
    user?.name.charAt(0).toUpperCase() + user?.name.slice(1);

  const handleLogout = () => {
    window.localStorage.removeItem(userKey);
    setUser(null);
    setNotification(null);
    setIsSuccess(null);
  };

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      setNotification('successfully delete blog');
      setIsSuccess(true);
    } catch (error) {
      console.error('error deleting blog:', error);
      setNotification('error deleting blog');
      setIsSuccess(false);

      setTimeout(() => {
        setNotification(null);
        setIsSuccess(false);
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
        {capitalizeName} logged in {''}
        <button onClick={handleLogout}>logout</button>
      </p>

      <CreateBlog
        blogs={blogs}
        setBlogs={setBlogs}
        setIsSuccess={setIsSuccess}
        setNotification={setNotification}
      />

      {blogs.length === 0 ? (
        <p>No blogs</p>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleDelete={() => handleDelete(blog.id)}
          />
        ))
      )}
    </>
  );
};

export default App;
