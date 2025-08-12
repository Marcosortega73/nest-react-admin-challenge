import { createContext, useContext, useMemo, useState } from 'react';

export type AuthUser = {
  firstName: string;
  id: string;
  role: string;
  email?: string;
  username?: string;
  lastName?: string;
  imageUrl?: string;
};

type AuthCtx = {
  authenticatedUser: AuthUser | null;
  setAuthenticatedUser: (u: AuthUser | null) => void;
  bootstrapping: boolean;
  setBootstrapping: (b: boolean) => void;
};

export const AuthenticationContext = createContext<AuthCtx>({} as AuthCtx);

export function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState<boolean>(true);

  const value = useMemo(
    () => ({ authenticatedUser, setAuthenticatedUser, bootstrapping, setBootstrapping }),
    [authenticatedUser, bootstrapping],
  );

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthenticationContext);
}
