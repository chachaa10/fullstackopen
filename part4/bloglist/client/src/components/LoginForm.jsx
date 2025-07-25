import blogService from '../services/blogs';
import loginService from '../services/login';

const LoginForm = ({
  username,
  password,
  setUser,
  setUsername,
  setPassword,
  setNotification,
  userKey,
}) => {
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      blogService.setToken(user.token);
      setUser(user);
      window.localStorage.setItem(userKey, JSON.stringify(user));

      setUsername('');
      setPassword('');
    } catch (error) {
      setNotification(error?.response?.data?.error);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };
  return (
    <>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label htmlFor='username'>username </label>
          <input
            type='text'
            name='Username'
            id='username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>password </label>
          <input
            type='text'
            name='Password'
            id='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type='submit'>Login</button>
      </form>
    </>
  );
};

export default LoginForm;
