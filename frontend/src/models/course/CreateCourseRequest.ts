export default interface CreateCourseRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isPublished?: boolean;
  resources?: string[];
  modules?: string[];
  lessons?: string[];
}
