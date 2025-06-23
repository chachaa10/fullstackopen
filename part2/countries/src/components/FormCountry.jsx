const FormCountry = ({ search, setSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='country'>Find country: </label>
      <input
        type='text'
        id='country'
        name='country'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default FormCountry;
