const Filter = ({ searchFilter, setSearchFilter }) => {
  return (
    <div>
      <label htmlFor='search'></label>
      <input
        id='search'
        type='text'
        value={searchFilter}
        onChange={(event) => setSearchFilter(event.target.value.toLowerCase())}
      />
    </div>
  );
};

export default Filter;
