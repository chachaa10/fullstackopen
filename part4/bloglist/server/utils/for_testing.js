const reverse = (string) => {
  return string.split('').reverse().join('');
};

const average = (array) => {
  const reducer = array.reduce((acc, cur) => acc + cur, 0);
  const averageOfArray = reducer / array.length;

  return array.length === 0 ? 0 : averageOfArray;
};

module.exports = { reverse, average };
