const TotalExercise = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <strong>total of {total} exercises</strong>;
};

export default TotalExercise;
