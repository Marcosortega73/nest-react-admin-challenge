export default interface CourseQuery {
  search?: string;
  filter?: 'all' | 'my-courses' | 'published' | 'draft';
}
