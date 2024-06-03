import React, { useEffect, useState, useContext } from 'react';

import supabase from '../supabase';
import Button from '@mui/material/Button';
import { SupabaseContext } from '../SupabaseContext';
import church from '../assets/church.png';
import {
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Typography as CardTitle,
} from '@mui/material';
import './style.scss';

function Info() {
  const { session, updateSession } = useContext(SupabaseContext);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader
          title="Church Details"
          subheader="Update your church's name, address, and contact information."
        />
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Church Name</span>
                <Button size="icon" variant="ghost">
                  <PenIcon className="h-5 w-5" />
                  <span className="sr-only">Edit Church Name</span>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Address</span>
                <Button size="icon" variant="ghost">
                  <PenIcon className="h-5 w-5" />
                  <span className="sr-only">Edit Address</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <Button size="icon" variant="ghost">
                  <PenIcon className="h-5 w-5" />
                  <span className="sr-only">Edit Phone</span>
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Email</span>
                <Button size="icon" variant="ghost">
                  <PenIcon className="h-5 w-5" />
                  <span className="sr-only">Edit Email</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardActionArea className="p-3">
          <Button variant="outlined" className="bg-dark text-white">
            Save Changes
          </Button>
        </CardActionArea>
      </Card>
    </div>
  );
}
export default Info;

function PenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
