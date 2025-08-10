import Courses from '@features/courses/pages/CoursesPage';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import useAuth from './hooks/useAuth';
import Contents from './pages/Contents';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Users from './pages/Users';
import { AuthWrapper, PrivateWrapper } from './Route';
import authService from './services/AuthService';

export default function App() {
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  const authenticate = async () => {
    try {
      const authResponse = await authService.refresh();
      setAuthenticatedUser(authResponse.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!authenticatedUser) {
      authenticate();
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded ? (
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
              <Courses />
            </PrivateWrapper>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <PrivateWrapper>
              <Contents />
            </PrivateWrapper>
          }
        />

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
  ) : null;
}
