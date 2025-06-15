import { useState } from 'react';
const Header = ({ text }) => {
  return (
    <>
      <h2>{text}</h2>
    </>
  );
};

const Button = ({ handleClick, text }) => {
  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  if (all === 0) {
    return <p>No feedback given</p>;
  }

  const computeAverage = (good - bad) / all;
  const average = isNaN(computeAverage) ? 0 : computeAverage.toFixed(1);

  const computePositive = (good / all) * 100;
  const positive = isNaN(computePositive) ? 0 : computePositive;

  return (
    <>
      <table>
        <tbody>
          <StatisticsLine text={'good'} value={good} />
          <StatisticsLine text={'neutral'} value={neutral} />
          <StatisticsLine text={'bad'} value={bad} />
          <StatisticsLine text={'all'} value={all} />
          <StatisticsLine text={'average'} value={average} />
          <StatisticsLine text={'positive'} value={`${positive}%`} />
        </tbody>
      </table>
    </>
  );
};

const StatisticsLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addGood = () => {
    setGood((prevGood) => prevGood + 1);
  };

  const addNeutral = () => {
    setNeutral((prevNeutral) => prevNeutral + 1);
  };

  const addBad = () => {
    setBad((prevBad) => prevBad + 1);
  };

  return (
    <>
      <Header text={'give feedback'} />
      <Button handleClick={addGood} text='good' />
      <Button handleClick={addNeutral} text='neutral' />
      <Button handleClick={addBad} text='bad' />

      <Header text={'statistics'} />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
