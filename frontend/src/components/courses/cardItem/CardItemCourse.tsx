import './CardItemCourse.css';

import { Eye, Users } from 'react-feather';

import CourseDefaultImg from '../../../assets/images/courses/courses-default.webp';
import IconButtonComponent from '../../shared/buttons/IconButtonComponent';

export default function CardItemCourse() {
  return (
    <div className="urbc_card">
      <div className="urbc_card__shine"></div>
      <div className="urbc_card__glow"></div>
      <div className="urbc_card__content">
        <div className="urbc_card__badge">NEW</div>
        <div className="urbc_card__image bg-[var(--brand-primary)]">
          <img
            src={CourseDefaultImg}
            alt="Course default"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>
        <div className="urbc_card__text">
          <p className="urbc_card__title">Course title</p>
          <p className="urbc_card__description">Course description</p>
        </div>
        <div className="urbc_card__footer">
          <div className="urbc_card__enrollment flex items-center gap-1">
            <Users />
            10
          </div>
          <div className="">
            <IconButtonComponent icon={<Eye />} shape="circle" size="sm" variant="primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
