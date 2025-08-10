import { AuthenticationContext } from 'context/AuthenticationContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

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
