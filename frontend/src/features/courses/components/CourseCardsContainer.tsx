import { BookOpen, Loader } from 'react-feather';

import { Course } from '../types';
import CardItemCourse from './CardItemCourse/CardItemCourse';
import EmptyState from './EmptyState';

interface CourseCardsContainerProps {
  data: Course[];
  isLoading: boolean;
}

export const CourseCardsContainer = ({ data, isLoading }: CourseCardsContainerProps) => {
  return (
    <div className="flex p-5 flex-wrap  md:justify-start sm:justify-center  gap-5 md:gap-7 xs:gap-2 sm:gap-3 w-full bg-gray-50 min-h-[calc(100vh-18rem)] ">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loader className="animate-spin" />
        </div>
      ) : data.length < 1 ? (
        <div className="flex justify-center items-center w-full h-full">
          <EmptyState
            icon={<BookOpen size={64} className="text-gray-400" />}
            title="No Courses found"
            description="No courses found that match the filters selected."
          />
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
