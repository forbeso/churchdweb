import React from 'react';
import { NavLink } from 'react-router-dom';

import Dot from '../marker/index.js';

import './style.scss';

const listStyle = {
  textDecoration: 'none',
};

function Nav() {
  return (
    <div className="topnav">
      <div className="mt-4 mb-5 bold logo d-flex">
        <i className="material-icons-round d-flex  align-items-center text-white">
          church{' '}
        </i>{' '}
        ChurchDeck{' '}
      </div>

      <div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              to="/cdeck/home"
              style={listStyle}
            >
              <i className="material-icons-round d-flex  align-items-center">
                home{' '}
              </i>{' '}
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              to="/cdeck/search"
              style={listStyle}
            >
              <i className="material-icons-round d-flex  align-items-center">
                search{' '}
              </i>{' '}
              Search
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/cdeck/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              style={listStyle}
            >
              <i className="material-icons-outlined d-flex  align-items-center">
                stacked_bar_chart{' '}
              </i>{' '}
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/cdeck/sermon"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              style={listStyle}
            >
              <i className="material-icons-outlined d-flex  align-items-center">
                speaker_notes{' '}
              </i>{' '}
              Tithes
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/cdeck/activities"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              style={listStyle}
            >
              <i className="material-icons-outlined d-flex  align-items-center">
                pool{' '}
              </i>{' '}
              Activities
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/cdeck/churchinfo"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link d-flex  align-items-center link setActive'
                  : 'nav-link d-flex  align-items-center link'
              }
              style={listStyle}
            >
              <i className="material-icons-outlined d-flex  align-items-center">
                church{' '}
              </i>{' '}
              My Church
            </NavLink>
          </li>
        </ul>
      </div>

      {/* <div className="d-flex justify-content-center  nav-bottom-box-container p-3 h-25">
        <div className="d-flex justify-content-center align-items-center box w-100 p-2">
          <h6>Go Pro</h6>
        </div>
      </div> */}
    </div>
  );
}

export default Nav;
