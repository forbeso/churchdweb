import React, { useEffect, useState, useContext } from 'react';

import supabase from '../supabase';

import { Link } from 'react-router-dom';
import { SupabaseContext } from '../SupabaseContext';
import viewmem from '../assets/viewyellow.png';
import './style.scss';

function Home() {
  const { session, updateSession } = useContext(SupabaseContext);

  return (
    <>
      <div className="hero-section d-flex justify-content-between mb-2 animate__animated animate__fadeIn">
        <div className="hero-content">
          <h1 className="display-5 mb-4">
            <strong>ChurchDeck: Church Membership Made Heavenly Easy!</strong>
          </h1>

          <p className="mb-4">Unify, Organize, and Empower Your Flock! ✞🐑🐑</p>
          <Link
            className="btn btn-warning d-block w-50 w-md-25 mb-3 mb-md-0"
            to="/cdeck/search"
          >
            See Your Flock
          </Link>
        </div>
        <div className="hero-image d-flex justify-content-around">
          <img
            src={viewmem}
            alt="ChurchDeck"
            style={{ width: '440px' }}
            className="img-fluid"
          />
        </div>
      </div>
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
        </div>
        <div className="card p-2 m-2">
          <div className="card-icon">
            <span className="material-icons-outlined text-danger">
              insights
            </span>
          </div>
          <div className="card-title">
            <h6>Dashboard Insights</h6>
          </div>
          <div className="card-body">
            <p>
              Insights at a Glance: Gain Valuable Member Insights with
              Interactive Graphs and Visualizations on our Dashboard Screen. See
              Your Church Community&apos;s Vital Statistics in a Single View.
            </p>
          </div>
        </div>
        <div className="card p-2 m-2">
          <div className="card-icon">
            <span className="material-icons-outlined text-danger">church</span>
          </div>
          <div className="card-title">
            <h6>Church Card</h6>
          </div>
          <div className="card-body">
            <p>
              Introducing the Church Card: Easily access essential information
              about your church, including its name, address, contact details,
              service times, and more.
            </p>
          </div>
        </div>
      </div>
      {/* <div className="d-flex h-50">
            <div className="heroTextContainer">
              <h3 className="display-4 heroWelcome p-3">
              ChurchDeck: Unleash the Power of Organized Membership!

              </h3>

              <p></p>
            </div>

            <div className='d-flex'>

            </div>
          </div> */}
    </>
  );
}
export default Home;
