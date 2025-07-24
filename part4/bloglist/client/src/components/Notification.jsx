const Notification = ({ isSuccess, notification }) => {
  const style = isSuccess ? 'success' : 'error';
  return <p className={style}>{notification}</p>;
};

export default Notification;
