import phoneService from '../services/phone';
const ContactList = ({
  persons,
  setPersons,
  setNotificationMessage,
  setIsSuccess,
}) => {
  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      phoneService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch(() => {
          setNotificationMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setIsSuccess(false);

          setTimeout(() => {
            setIsSuccess(null);
            setNotificationMessage(null);
          }, 15000);
        });
    }
  };

  return (
    <div>
      {persons.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        persons.map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{' '}
            <button
              onClick={() => {
                handleDelete(person.id);
              }}
            >
              delete
            </button>
          </p>
        ))
      )}
    </div>
  );
};

export default ContactList;
