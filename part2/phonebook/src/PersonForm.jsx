import { useState } from 'react';
import phoneService from './services/phone';
import { capitalizedName } from './utils/capitalizedName';

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!newName.trim() || !newPhone.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmMessage = `${capitalizedName(
        newName
      )} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(confirmMessage)) {
        const updatedPersonNumber = { ...existingPerson, number: newPhone };
        phoneService
          .updatePerson(existingPerson.id, updatedPersonNumber)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName('');
            setNewPhone('');
          });
      }
      return;
    }

    const newPerson = {
      name: capitalizedName(newName),
      number: newPhone,
    };

    phoneService
      .createPerson(newPerson)
      .then((returnedPerson) => {
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewPhone('');
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <div>
        <label htmlFor='name'>Name: </label>
        <input
          id='name'
          type='text'
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor='phone'>Phone Number: </label>
        <input
          id='phone'
          type='text'
          value={newPhone}
          onChange={(event) => setNewPhone(event.target.value)}
        />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
