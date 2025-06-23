import { useEffect, useState } from 'react';
import weatherService from '../services/weatherApi';
const Country = ({ filteredCountries }) => {
  const [weather, setWeather] = useState(null);
  const country = filteredCountries[0];
  const icon = `http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`;

  useEffect(() => {
    weatherService.getWeather(country.name.common).then((data) => {
      console.log(data);
      setWeather(data);
    });
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p className='capital'>Capital: {country.capital}</p>
      <p className='area'>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      {<img src={country.flags.png} alt={country.name.common} />}

      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {weather?.main.temp} Celcius</p>
      {<img src={icon} alt={country.name.common} />}
      <p>Wind: {weather?.wind.speed} m/s</p>
    </div>
  );
};

export default Country;
