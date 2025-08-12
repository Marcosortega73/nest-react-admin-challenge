import SiderBarBg from '@assets/images/brand/sidemenu-bg.webp';
import BrandLogo from '@assets/images/brand/urbano-logo-white.webp';
import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    navigate('/login');
  };

  return (
    <div
      className={`sidebar  flex flex-col justify-between ${className}  h-full shadow-2xl rounded-lg bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${SiderBarBg})` }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/60 lg:bg-gradient-to-b lg:from-black/70 lg:via-black/40 lg:to-black/70" />

      <nav className="relative z-10 mt-5 lg:mt-20 flex flex-col gap-3 flex-grow">
        <div className="brand-logo-container w-full flex justify-center mb-6">
          <img src={BrandLogo} alt="Urbano Academy" className="object-contain w-auto" />
        </div>

        <SidebarItem to="/" active={location.pathname === '/'}>
          <Home /> Dashboard
        </SidebarItem>

        <SidebarItem to="/courses" active={location.pathname.includes('/courses')}>
          <BookOpen /> Courses
        </SidebarItem>

        {authenticatedUser?.role === 'admin' && (
          <SidebarItem to="/users" active={location.pathname.includes('/users')}>
            <Users /> Users
          </SidebarItem>
        )}
      </nav>

      <button
        className="relative z-10 text-red-500 rounded-md p-3 transition-all hover:brightness-110 active:scale-95 flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
