import React, { useContext, useState } from 'react';

import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';

import { NavLink } from 'react-router-dom';
import ChurchIcon from '../assets/churchicon';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

import CloseIcon from '@mui/icons-material/Close';
import {
  LayoutDashboardIcon,
  ActivityIcon,
  UsersIcon,
  DollarSignIcon,
  FileTextIcon,
  SettingsIcon,
} from '../assets/icons/svgs';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { stripEmail } from '../utils/utils';

const listStyle = {
  textDecoration: 'none',
};

export default function Newnav({ isNavOpen, toggleNav }) {
  const { session, updateSession } = useContext(SupabaseContext);

  return (
    <div className="flex flex-col ">
      <Drawer variant="permanent" anchor="left" className="border-rs">
        <div className="mb-6 space-y-2 bg-white">
          <div className="flex justify-between px-3 py-3">
            <p className="text-md font-bold uppercase text-teal_look">
              {session && stripEmail(session.user.email)}
            </p>

            <p className="text-md font-semibold">
              <CloseIcon
                onClick={toggleNav}
                className="text-red-600 cursor-pointer"
              />
            </p>
          </div>

          <List>
            <NavLink to="/cdeck/home" style={listStyle}>
              <ListItemButton component="a" href="#">
                <ListItemIcon>
                  <ChurchIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </NavLink>
            <NavLink to="/cdeck/search" style={listStyle}>
              <ListItemButton component="a">
                <ListItemIcon>
                  <LayoutDashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItemButton>
            </NavLink>
            <List component="div" disablePadding>
              <NavLink to="/cdeck/events" style={listStyle}>
                <ListItemButton component="a" href="#" className="pl-4">
                  <ListItemIcon>
                    <ActivityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Events" />
                </ListItemButton>
              </NavLink>
              <NavLink to="/cdeck/dashboard" style={listStyle}>
                <ListItemButton component="a" href="#">
                  <ListItemIcon>
                    <LayoutDashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </NavLink>
            </List>
            <NavLink to="/cdeck/tithes" style={listStyle}>
              <ListItemButton component="a" href="#">
                <ListItemIcon>
                  <DollarSignIcon />
                </ListItemIcon>
                <ListItemText primary="Tithes & Offerings" />
              </ListItemButton>
            </NavLink>
            <List component="div" disablePadding>
              <ListItemButton component="a" href="#" className="pl-4">
                <ListItemIcon>
                  <FileTextIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </List>
            <NavLink to="/cdeck/info" style={listStyle}>
              <List component="div" disablePadding>
                <ListItemButton component="a" href="#" className="pl-4">
                  <ListItemIcon>
                    <InfoOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Church" />
                </ListItemButton>
              </List>
            </NavLink>
            <NavLink to="/cdeck/settings" style={listStyle}>
              <List component="div" disablePadding>
                <ListItemButton component="a" href="#" className="pl-4">
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItemButton>
              </List>
            </NavLink>
          </List>
        </div>
      </Drawer>
    </div>
  );
}
