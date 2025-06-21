import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const getPersons = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const createPerson = (person) => {
  return axios.post(baseUrl, person).then((response) => response.data);
};

const updatePerson = (id, person) => {
  return axios
    .put(`${baseUrl}/${id}`, person)
    .then((response) => response.data);
};

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getPersons, createPerson, updatePerson, deletePerson };
