import { useEffect, useMemo, useState } from 'react';
import ContactList from './ContactList';
import Filter from './Filter';
import PersonForm from './PersonForm';
import phoneService from './services/phone';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    phoneService
      .getPersons()
      .then((returnedPersons) => setPersons(returnedPersons));
  }, []);

  const filteredPersons = useMemo(() => {
    return persons.filter((person) =>
      person.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [persons, searchFilter]);

  return (
    <>
      <h1>Phonebook</h1>

      <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} />

      <PersonForm persons={persons} setPersons={setPersons} />

      <h2>Numbers</h2>
      <ContactList persons={filteredPersons} setPersons={setPersons} />
    </>
  );
};

export default App;
