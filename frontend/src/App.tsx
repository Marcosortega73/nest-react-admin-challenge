import AuthBootstrap from './app/providers/AuthBootstrap';
import QueryProvider from './app/providers/QueryProvider';
import AppRouter from './app/router/AppRouter';
import { AuthenticationProvider } from './context/AuthenticationContext';

export default function App() {
  return (
    <AuthenticationProvider>
      <QueryProvider>
        <AuthBootstrap>
          <AppRouter />
        </AuthBootstrap>
      </QueryProvider>
    </AuthenticationProvider>
  );
}
