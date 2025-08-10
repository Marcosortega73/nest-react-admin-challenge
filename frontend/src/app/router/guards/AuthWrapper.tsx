import { AuthenticationContext } from 'context/AuthenticationContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

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
