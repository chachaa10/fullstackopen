import Country from './Country';

const CountryList = ({ listCountries, search, setSearch }) => {
  const filteredCountries = listCountries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {listCountries.length === 0 ? (
        <p>Loading...</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 0 ? (
        <p>No matches</p>
      ) : filteredCountries.length === 1 ? (
        <Country filteredCountries={filteredCountries} />
      ) : (
        <ul className='country-list'>
          {filteredCountries.map((country) => (
            <li key={country.name.common}>
              {country.name.common}{' '}
              <button onClick={() => setSearch(country.name.common)}>
                Show
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default CountryList;
