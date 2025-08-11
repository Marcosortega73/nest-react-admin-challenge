import { CoursesLayout } from '@features/courses/components';
import CoursesPage from '@features/courses/pages/CoursesPage';
import CourseWizardPage from '@features/courses/pages/CourseWizardPage';
import Contents from '@pages/Contents';
import Dashboard from '@pages/Dashboard';
import Login from '@pages/Login';
import Users from '@pages/Users';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthWrapper, PrivateWrapper } from './guards';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateWrapper>
              <Dashboard />
            </PrivateWrapper>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateWrapper roles={['admin']}>
              <Users />
            </PrivateWrapper>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateWrapper>
              <CoursesLayout />
            </PrivateWrapper>
          }
        >
          <Route index element={<CoursesPage />} /> {/* /courses */}
          <Route path="new" element={<CourseWizardPage />} /> {/* /courses/new */}
          <Route path=":id" element={<Contents />} /> {/* /courses/:id */}
          <Route path=":id/edit" element={<CourseWizardPage />} /> {/* /courses/:id/edit */}
        </Route>

        <Route
          path="/login"
          element={
            <AuthWrapper>
              <Login />
            </AuthWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
