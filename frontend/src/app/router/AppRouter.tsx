import CoursesPage from '@features/courses/pages/CoursesPage';
import Contents from '@pages/Contents';
import Dashboard from '@pages/Dashboard';
import Login from '@pages/Login';
import Users from '@pages/Users';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthWrapper, PrivateWrapper } from './guards';

// opcional si usás wizard:
// import CourseWizardPage from '@/features/courses/pages/CourseWizardPage';

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
              <CoursesPage />
            </PrivateWrapper>
          }
        />
        {/* Detalle/Contenido */}
        <Route
          path="/courses/:id"
          element={
            <PrivateWrapper>
              <Contents />
            </PrivateWrapper>
          }
        />
        {/* Crear/Editar (wizard) — dejalo comentado si aún no lo tenés */}
        {/*
        <Route
          path="/courses/new"
          element={
            <PrivateWrapper>
              <CourseWizardPage mode="create" />
            </PrivateWrapper>
          }
        />
        <Route
          path="/courses/:id/edit"
          element={
            <PrivateWrapper>
              <CourseWizardPage mode="edit" />
            </PrivateWrapper>
          }
        />
        */}
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
