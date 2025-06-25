const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null;
  }

  const success = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const notSuccess = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <p style={isSuccess ? success : notSuccess}>{message}</p>;
};

export default Notification;
