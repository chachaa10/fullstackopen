import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';
import CountryList from './components/CountryList';
import FormCountry from './components/FormCountry';
import countryService from './services/countryApi';

const App = () => {
  const [search, setSearch] = useState('');
  const [listCountries, setListCountries] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    countryService.getAllCountries().then((data) => {
      setListCountries(data);
    });
  }, []);

  return (
    <>
      <FormCountry search={search} setSearch={setSearch} />

      <CountryList
        listCountries={listCountries}
        search={debouncedSearch}
        setSearch={setSearch}
      />
    </>
  );
};

export default App;
