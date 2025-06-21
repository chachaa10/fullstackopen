import Content from './Content';
import Header from './Header';
import TotalExercises from './TotalExercise';

const CourseCard = ({ courses }) => {
  return (
    <>
      {courses.map((course) => (
        <div key={course.id}>
          <Header level='h2' text={course.name} />

          <Content parts={course.parts} />

          <TotalExercises parts={course.parts} />
        </div>
      ))}
    </>
  );
};

export default CourseCard;
