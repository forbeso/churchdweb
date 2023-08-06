import React, { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import Nav from '../nav';
import './style.scss';

function Layout({ children }) {
  const { session, updateSession } = useContext(SupabaseContext);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const signOutUser = async () => {
    if (session) {
      const { error } = await supabase.auth.signOut();
      navigate('/');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div
          className={`col-md-3 col-lg-2 pl-0 pr-0 ${
            isNavOpen ? 'd-block d-md-none' : 'd-none d-md-block'
          }`}
        >
          <Nav closeNav={closeNav} />
        </div>

        <div
          className="col-md-9 col-lg-10 overflow"
          style={{ backgroundColor: '#f4f7ff' }}
        >
          <div className="mt-3 mb-5 d-flex justify-content-between">
            <div className="d-block d-md-none">
              <button className="btn nav-button" onClick={toggleNav}>
                {isNavOpen ? (
                  'Close'
                ) : (
                  <span className="material-icons-outlined">menu</span>
                )}
              </button>
            </div>
            <div className="d-flex flex-column align-items-end">
              <p></p>
              <strong>
                <p className="text-dark">Hi {session && session.user.email}</p>
              </strong>
            </div>

            <div className="">
              <strong className="cursor-pointer">
                <button
                  type="button"
                  className="btn logout border"
                  onClick={signOutUser}
                >
                  <strong>Sign Out</strong>
                </button>
              </strong>
            </div>
          </div>

          <main onClick={closeNav}>
            {children}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;
