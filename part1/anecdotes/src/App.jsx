import { useState } from 'react';

const Header = ({ text }) => <h2>{text}</h2>;

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const [haveVote, setHaveVote] = useState(false);

  const highestVote = votes.indexOf(Math.max(...votes));

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
    setHaveVote(true);
  };

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    if (randomIndex === selected) return handleNextAnecdote();
    setSelected(randomIndex);
  };

  return (
    <>
      <Header text='Anecdote of the day' />
      <p>{anecdotes[selected]}</p>
      <p>
        has {votes[selected]} {votes[selected] === 0 ? 'vote' : 'votes'}
      </p>

      <Header text='Anecdote with most votes' />
      {haveVote && (
        <>
          <p>{anecdotes[highestVote]}</p>
          <p>has {votes[highestVote]} votes</p>
        </>
      )}

      <Button onClick={handleNextAnecdote} text='next anecdote' />
      <Button onClick={handleVote} text='vote' />
    </>
  );
};

export default App;
