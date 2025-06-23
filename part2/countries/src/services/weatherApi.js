const WEATHER_KEY = import.meta.env.VITE_WEATHER_KEY;

async function getLocation(city) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${WEATHER_KEY}`
    );
    if (!response.ok) throw new Error('Weather data not found for ' + city);
    const data = await response.json();
    return data[0];
  } catch (error) {
    alert(error);
  }
}

async function getWeather(city) {
  try {
    const location = await getLocation(city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_KEY}`
    );
    if (!response.ok) throw new Error('Weather data not found for ' + city);
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export default { getWeather };
