import { Loader } from 'react-feather';

import { Course } from '../types';
import CardItemCourse from './CardItemCourse/CardItemCourse';

interface CourseCardsContainerProps {
  data: Course[];
  isLoading: boolean;
}

export const CourseCardsContainer = ({ data, isLoading }: CourseCardsContainerProps) => {
  console.log(data);
  return (
    <div className="flex p-5 flex-wrap  md:justify-start sm:justify-center items-center gap-5 md:gap-7 xs:gap-2 sm:gap-3  w-full">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <>
          {data.map(item => (
            <CardItemCourse key={item.id} course={item} />
          ))}
        </>
      )}
    </div>
  );
};
