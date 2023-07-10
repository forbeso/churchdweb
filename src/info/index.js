import React, { useEffect, useState, useContext } from 'react';

import supabase from '../supabase';

import { SupabaseContext } from '../SupabaseContext';
import church from '../assets/church.png';

import './style.scss';

function Info() {
  const { session, updateSession } = useContext(SupabaseContext);

  return (
    <>
      <div className="text-center">
        <h1>Church Information</h1>
        <p>Manage and update church details and important information.</p>
      </div>
      <div className="card-section d-flex animate__animated animate__fadeIn text-center justify-content-center">
        <div className="card p-2 m-2 w-50">
          <div className="yellow-bar"></div>
          <div className="card-icon mt-2">
            <img
              src={church}
              alt="chuurch_icon"
              // style={{ width: '200px' }}
              className="img-fluid church-icon"
            />
          </div>
          <div className="card-title">
            <h2>ABUNDANT LIFE MINISTRIES</h2>
            <small>
              A church loving God, loving others, and serving the world
            </small>
          </div>
          <div className="card-body">
            <div className="church-info">
              <p>
                <strong>Address:</strong> 123 Main Street, Cityville, State
              </p>
              <p>
                <strong>Established:</strong> January 1, 19XX
              </p>
              <p>
                <strong>Contact:</strong> (876) 456-7890, info@abundantlife.org
              </p>
              <p>
                <strong>Pastor's Name:</strong> Rev John Hines
              </p>
              <p>
                <strong>Service Times:</strong> Sundays at 9:00 AM and 11:00 AM
              </p>
              <p>
                <strong>Website:</strong> www.abundantlife.org
              </p>
              <p>
                <strong>Social Media Handles:</strong> Facebook:
                @abundantlifechurch, Instagram: @abundantlife.ministries
              </p>
              <p>
                <strong>Ministries:</strong> Youth Ministry, Women's Ministry,
                Men's Fellowship, Community Outreach
              </p>
            </div>
          </div>
          <div className="card-link">
            <a href="#">Learn More</a>
          </div>
        </div>
      </div>
    </>
  );
}
export default Info;
