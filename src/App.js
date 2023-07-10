
import React, { useState, useMemo } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

import './App.css';
import Search from './search/index';
import Login from './login/index';
import Data from './data/index';
import Home from './land/index';
import Layout from './layout/index';
import Info from './info/index';
import { SupabaseProvider } from './SupabaseContext';
import Activities from './activities';
import TithesPage from './tithes';

function NoInternetScreen() {
  return (
    <div className="container-fluid">
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
            <Route index path="/" element={<Login />} />
          ) : (
            <Route index element={<NoInternetScreen />} />
          )}

          <Route path="/cdeck" element={<Layout />}>
            <Route path="/cdeck/search" element={<Search />} />
            <Route path="/cdeck/churchinfo" element={<Info />} />
            <Route path="/cdeck/dashboard" element={<Data />} />
            <Route path="/cdeck/home" element={<Home />} />
            <Route path="/cdeck/activities" element={<Activities />} />
            <Route path="/cdeck/tithes" element={<TithesPage />} />
          </Route>
        </Routes>
      </SupabaseProvider>
    </Router>
  );
}
