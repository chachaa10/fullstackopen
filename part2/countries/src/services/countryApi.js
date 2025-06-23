async function getAllCountries() {
  try {
    const response = await fetch(
      'https://studies.cs.helsinki.fi/restcountries/api/all'
    );
    if (!response.ok) {
      throw new Error('Data not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error);
  }
}

export default { getAllCountries };
