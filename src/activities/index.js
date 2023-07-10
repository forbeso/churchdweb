import React, { useEffect, useState, useContext } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

import supabase from '../supabase';

import Nav from '../nav';

import { SupabaseContext } from '../SupabaseContext';
import Loader from '../loader';
import './style.scss';

import { ReactComponent as Image } from '../assets/working.svg';

function Activities() {
  return (
   <div className=''>
<div>
      <h1 className="text-center">Under Construction</h1>
      <p className="text-center">We're sorry, but this page is currently under construction. Please check back later for updates.</p>
    </div>    <div className="image-container">
      <Image className="image" />
      </div>
      
   </div>
  );
}

export default Activities;
