const Notification = ({ isSuccess, notification }) => {
  if (isSuccess) {
    return <p className='success'>{notification}</p>;
  } else if (!isSuccess) {
    return <p className='error'>{notification}</p>;
  }
};

export default Notification;
