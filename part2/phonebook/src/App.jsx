import { useEffect, useState } from 'react';
import ContactList from './components/ContactList';
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import phoneService from './services/phone';

const App = () => {
  const [persons, setPersons] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);

  useEffect(() => {
    phoneService
      .getPersons()
      .then((returnedPersons) => setPersons(returnedPersons));
  }, [persons]);

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  if (!persons) {
    return null;
  }

  return (
    <>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} isSuccess={isSuccess} />

      <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} />

      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setNotificationMessage={setNotificationMessage}
        setIsSuccess={setIsSuccess}
      />

      <h2>Numbers</h2>
      <ContactList
        persons={filteredPersons}
        setPersons={setPersons}
        setNotificationMessage={setNotificationMessage}
        setIsSuccess={setIsSuccess}
      />
    </>
  );
};

export default App;
