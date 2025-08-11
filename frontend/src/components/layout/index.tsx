import { useState } from 'react';
import { Menu, X } from 'react-feather';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <div className="urb-layout min-h-screen flex flex-col w-full">
        <AppBar />
        <Sidebar className={showSidebar ? 'show' : ''} />
        <div className="pt-5 lg:ml-72 px-5 sm:px-10 py-5">{children}</div>
        <button
          className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
            showSidebar ? 'right-5' : 'left-5'
          }`}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>
    </>
  );
}
