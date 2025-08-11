import { Outlet } from 'react-router-dom';

/**
 * Layout component for courses section
 * Handles nested routes: /courses, /courses/new, /courses/:id, /courses/:id/edit
 */
export default function CoursesLayout() {
  return <Outlet />;
}
