import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Group as MembersIcon,
  Event as EventsIcon,
  MonetizationOn as TithesIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';

const listStyle = {
  textDecoration: 'none',
};

export default function Newnav({ isNavOpen, toggleNav }) {
  return (
    <div className="flex flex-col ">
      <Drawer
        variant="permanent"
        anchor="left"
        className="border-r bg-white dark:border-gray-800 dark:bg-gray-950 "
      >
        <div className="mb-6 space-y-2">
          <div className="flex justify-between px-3 py-3">
            <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
              Admin
            </p>

            <p className="text-md font-semibold">
              <CloseIcon
                onClick={toggleNav}
                className="text-red-600 cursor-pointer"
              />
            </p>
          </div>

          <List>
            <NavLink to="/cdeck/search" style={listStyle}>
              <ListItemButton button component="a" href="#">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Search" />
              </ListItemButton>
            </NavLink>
            <List component="div" disablePadding>
              <ListItemButton component="a" href="#" className="pl-4">
                <ListItemIcon>
                  <MembersIcon />
                </ListItemIcon>
                <ListItemText primary="Members" />
              </ListItemButton>
              <ListItemButton button component="a" href="#" className="pl-4">
                <ListItemIcon>
                  <EventsIcon />
                </ListItemIcon>
                <ListItemText primary="Events" />
              </ListItemButton>
            </List>
            <ListItemButton button component="a" href="#">
              <ListItemIcon>
                <TithesIcon />
              </ListItemIcon>
              <ListItemText primary="Tithes & Offerings" />
            </ListItemButton>
            <List component="div" disablePadding>
              <ListItemButton button component="a" href="#" className="pl-4">
                <ListItemIcon>
                  <ReportsIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </List>
          </List>
        </div>
      </Drawer>
    </div>
  );
}
