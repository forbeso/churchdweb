import React, { useEffect, useState, useContext } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';

import supabase from '../supabase';

import Nav from '../nav';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { SupabaseContext } from '../SupabaseContext';
import Loader from '../loader';
import './style.scss';

function Activities() {
  return (
    <div className="cardContainer">
      <div className="card-section d-flex animate__animated animate__fadeInUp">
        <div className="card p-2 m-2">
          <div className="card-icon">
            <span className="material-icons-outlined text-danger">search</span>
          </div>
          <div className="card-title">
            <h6>Efficient Member Search</h6>
          </div>
          <div className="card-body">
            <p>
              Search & Filter with Ease: Find, Sort, and Manage Your Church
              Members Effortlessly. Edit and Add New Members Seamlessly
            </p>
          </div>
          <div className="card-link">
            <a href="#">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
