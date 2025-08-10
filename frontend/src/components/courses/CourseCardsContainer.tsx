import CardItemCourse from './cardItem/CardItemCourse';

export const CourseCardsContainer = () => {
  return (
    <div className="flex flex-wrap justify-evenly items-center gap-5 md:gap-7 xs:gap-2 sm:gap-3  w-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
        <CardItemCourse key={item} />
      ))}
    </div>
  );
};
