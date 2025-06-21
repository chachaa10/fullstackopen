import phoneService from './services/phone';
const ContactList = ({ persons, setPersons }) => {
  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      phoneService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          alert(error.response.data.error);
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
