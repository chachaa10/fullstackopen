import axios from 'axios';

const baseUrl = 'api/persons';

const getPersons = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createPerson = async (person) => {
  const response = await axios.post(baseUrl, person);
  return response.data;
};

const updatePerson = async (id, person) => {
  const response = await axios.put(`${baseUrl}/${id}`, person);
  return response.data;
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getPersons, createPerson, updatePerson, deletePerson };
