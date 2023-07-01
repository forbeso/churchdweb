import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';

import Nav from '../nav';

import './style.scss';

function Layout({ children }) {
  const { session, updateSession } = useContext(SupabaseContext);
  const navigate = useNavigate();

  const signOutUser = async () => {
    if (session) {
      const { error } = await supabase.auth.signOut();
      navigate('/');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row h-100">
        <div className="col-2 pl-0 pr-0">
          <Nav />
        </div>

        <div className="col-10 overflow" style={{ backgroundColor: '#f4f7ff' }}>
          <div className="mt-3 mb-5 d-flex justify-content-between">
            <div className="w-25">
              <strong>
                {' '}
                <p className="text-success">
                  Hi {session && session.user.email}
                </p>
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

          <main>
            {children}
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
export default Layout;
