import { useState } from 'react';
import phoneService from '../services/phone';
import { capitalizedName } from '../utils/capitalizedName';

const PersonForm = ({
  persons,
  setPersons,
  setNotificationMessage,
  setIsSuccess,
}) => {
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newName.trim() || !newPhone.trim()) {
      setNotificationMessage('Name or phone number cannot be empty');
      setIsSuccess(false);
      setTimeout(() => {
        setIsSuccess(null);
        setNotificationMessage(null);
      }, 5000);
      return;
    }

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    if (existingPerson) {
      const confirmMessage = `${capitalizedName(
        newName
      )} is already added to phone book, replace the old number with a new one?`;
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

            setNotificationMessage(
              `Updated ${capitalizedName(newName)} with new number: ${newPhone}`
            );
            setIsSuccess(true);
            setTimeout(() => {
              setIsSuccess(null);
              setNotificationMessage(null);
            }, 5000);

            setNewName('');
            setNewPhone('');
          })
          .catch(() => {
            setIsSuccess(false);
            setNotificationMessage(
              `Information of ${capitalizedName(
                newName
              )} has already been removed from server`
            );
            setTimeout(() => {
              setIsSuccess(null);
              setNotificationMessage(null);
            }, 5000);
          });
      }
      return;
    }

    const newPerson = {
      name: capitalizedName(newName.trim()),
      number: newPhone,
    };

    phoneService.createPerson(newPerson).then((returnedPerson) => {
      setPersons([...persons, returnedPerson]);

      setNotificationMessage(
        `Added ${capitalizedName(newName)} with number: ${newPhone}`
      );
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(null);
        setNotificationMessage(null);
      }, 5000);

      setNewName('');
      setNewPhone('');
    });
  };

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
