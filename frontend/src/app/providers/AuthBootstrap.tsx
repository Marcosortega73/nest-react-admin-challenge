import useAuth from '@hooks/useAuth';
import authService from '@services/AuthService';
import { ReactNode, useEffect } from 'react';

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const { authenticatedUser, setAuthenticatedUser, bootstrapping, setBootstrapping } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        if (!authenticatedUser) {
          const auth = await authService.refresh();
          setAuthenticatedUser(auth.user);
        }
      } catch {
        setAuthenticatedUser(null);
      } finally {
        setBootstrapping(false);
      }
    };
    if (bootstrapping) run();
  }, [bootstrapping]);

  return bootstrapping ? null : <>{children}</>;
}
