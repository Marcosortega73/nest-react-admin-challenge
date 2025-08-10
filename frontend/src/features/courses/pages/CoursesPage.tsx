import Layout from '@components/layout';
import ButtonComponent from '@components/shared/buttons/ButtonComponent';
import Modal from '@components/shared/Modal';
import { CourseCardsContainer, HeaderPageCourse } from '@features/courses/components';
import courseService from '@features/courses/services/course.api';
import useAuth from '@hooks/useAuth';
import CreateCourseRequest from '@models/course/CreateCourseRequest';
import { useMemo, useState } from 'react';
import { Loader, Plus, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

import { CourseFiltersComponent } from '../components/CourseFiltersComponent';
import { useCourses } from '../hooks/useCourses';
import { FindCoursesParams } from '../types';

export default function CoursesPage() {
  const [filters, setFilters] = useState<FindCoursesParams>({ name: '', description: '' });

  const queryFilters = useMemo<FindCoursesParams>(
    () => ({
      name: filters.name?.trim() || undefined,
      description: filters.description?.trim() || undefined,
    }),
    [filters.name, filters.description],
  );

  const { data = [], isLoading, error: fetchError } = useCourses(queryFilters);

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);

      queryClient.invalidateQueries(['courses']);

      setAddCourseShow(false);
      reset();
      setError(undefined);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <HeaderPageCourse
        title="Courses"
        isUser={authenticatedUser.role === 'user'}
        buttonNew={
          <ButtonComponent
            title="Add Course"
            icon={<Plus />}
            onClick={() => setAddCourseShow(true)}
            variant="primary"
            positionIcon="left"
            size="md"
          />
        }
      />
      {fetchError && (
        <div className="text-red-600 p-3 border rounded bg-red-50 mb-3">
          {(fetchError as any)?.message ?? 'Error loading courses'}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center w-full h-full">
          <Loader className="animate-spin" />
        </div>
      )}

      {!isLoading && !fetchError && (
        <>
          <CourseFiltersComponent filters={filters} setFilters={setFilters} />
          {/* <CoursesTable data={data} isLoading={isLoading} /> */}
          <CourseCardsContainer data={data} isLoading={isLoading} />
        </>
      )}
      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form className="flex flex-col gap-5 mt-5" onSubmit={handleSubmit(saveCourse)}>
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? <Loader className="animate-spin mx-auto" /> : 'Save'}
          </button>
          {error ? <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">{error}</div> : null}
        </form>
      </Modal>
    </Layout>
  );
}
