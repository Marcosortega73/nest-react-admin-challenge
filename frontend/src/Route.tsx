import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthenticationContext } from './context/AuthenticationContext';

interface PrivateWrapperProps {
  children: React.ReactElement;
  roles?: string[];
}

export function PrivateWrapper({ children, roles }: PrivateWrapperProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authenticatedUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

interface AuthWrapperProps {
  children: React.ReactElement;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  if (authenticatedUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
