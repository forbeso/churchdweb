import React, { useContext, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';

import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import './style.scss';
import ChurchIcon from '../assets/churchicon';
import Newnav from '../newnav';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Avatar from 'boring-avatars';
import { stripEmail } from '../utils/utils';

function Layout({ children }) {
  const { session, updateSession } = useContext(SupabaseContext);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const signOutUser = async () => {
    if (session) {
      const { error } = await supabase.auth.signOut();
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <header className="flex flex-row items-center justify-between bg-white px-6 py-4 border-gray-800">
        <div className="flex items-center gap-4">
          <div>
            <MenuIcon onClick={toggleNav} className="cursor-pointer"></MenuIcon>
          </div>
          <Link className="flex items-center gap-2" to="/cdeck/home">
            <ChurchIcon className="h-6 w-6 text-dark " />
            <span className="text-lg font-semibold text-dark ">Churchdeck</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsNoneIcon />
          {session && stripEmail(session.user.email)}
          <Avatar
            size={40}
            name="Maria Mitchell"
            variant="marble"
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        </div>
      </header>

      {isNavOpen && <Newnav isNavOpen={isNavOpen} toggleNav={toggleNav} />}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        {children}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
