import React, { useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Search from './search/index';
import Login from './login/index';
import Data from './data/index';
import Land from './land/index';
import Layout from './layout/index';
import Info from './info/index';
import { SupabaseProvider } from './SupabaseContext';
import Activities from './activities';
import TithesPage from './tithes';
import NewLogin from './newlogin';
import NewSearch from './newsearch';
import NewTithes from './newtithes';
import NewEvent from './newevent';
import NewDashboard from './newdashboard';
import Settings from './settings';

function NoInternetScreen() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Please connect to the internet</h1>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useMemo(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      <SupabaseProvider>
        <Routes>
          {isOnline ? (
            <Route index path="/" element={<NewLogin />} />
          ) : (
            <Route index element={<NoInternetScreen />} />
          )}

          <Route path="/cdeck" element={<Layout />}>
            <Route path="/cdeck/search" element={<NewSearch />} />
            <Route path="/cdeck/info" element={<Info />} />
            <Route path="/cdeck/dashboard" element={<NewDashboard />} />
            <Route path="/cdeck/home" element={<Land />} />
            <Route path="/cdeck/activities" element={<Activities />} />
            <Route path="/cdeck/tithes" element={<NewTithes />} />
            <Route path="/cdeck/events" element={<NewEvent />} />
            <Route path="/cdeck/settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          theme="colored"
          autoClose={5000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SupabaseProvider>
    </Router>
  );
}
