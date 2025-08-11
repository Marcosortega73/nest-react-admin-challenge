import CourseDefaultImg from '@assets/images/courses/courses-default.webp';
import { Course } from '@features/courses/types';
import { IconButtonComponent } from '@shared/components/buttons';
import { Eye, Users } from 'react-feather';

import styles from './CardItemCourse.module.css';

interface CardItemCourseProps {
  course: Course;
}

export default function CardItemCourse({ course }: CardItemCourseProps) {
  return (
    <div className={styles.urbc_card}>
      <div className={`${styles.urbc_card__shine}`}></div>
      <div className={`${styles.urbc_card__glow}`}></div>
      <div className={`${styles.urbc_card__content}`}>
        <div className={`${styles.urbc_card__badge}`}>NEW</div>
        <div className={`${styles.urbc_card__image}`}>
          <img
            src={CourseDefaultImg}
            alt="Course default"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>
        <div className={`${styles.urbc_card__text}`}>
          <p className={`${styles.urbc_card__title}`}>{course.name}</p>
          <p className={`${styles.urbc_card__description}`}>{course.description}</p>
        </div>
        <div className={`${styles.urbc_card__footer}`}>
          <div className={`${styles.urbc_card__enrollment} flex items-center gap-1`}>
            <Users />
            10
          </div>
          <div className={`${styles.urbc_card__enrollment}`}>
            <IconButtonComponent icon={<Eye />} shape="circle" size="sm" variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
