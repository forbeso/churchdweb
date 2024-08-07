import React, { useEffect, useState, useContext } from 'react';
import supabase from '../supabase';

import Loader from '../loader';
import { SupabaseContext } from '../SupabaseContext';

import { Card, CardContent, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarChooseDate from '../calendarcomp';
import TopAttendeesComp from '../topAttendeesComp';

export default function NewEvent() {
  const { session, updateSession } = useContext(SupabaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }

  useEffect(() => {
    async function getAllEvents() {
      setIsLoading(true);
      const { data: events, eventsError } = await supabase
        .from('events')
        .select(
          `
          event_id,
          event_type,
          start_date,
          end_date,
          start_time,
          end_time,
          event_descr,
          location,
          memberAttendance ( event_id, attendance_date, attendance_time, member_id )
        `,
        );

      setIsLoading(false);
      setEvents(events);
    }
    getAllEvents();
  }, []);

  const currentDate = new Date();

  return (
    <div className="grid h-full md:grid-cols-[1fr_280px]">
      <div className="flex flex-col animate__animated animate__fadeIn">
        <div className="flex h-[60px] items-center border-b bg-white px-6">
          <h2 className="text-2xl font-bold md:text-4xl">Your Activities</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-6 p-6">
            <CalendarChooseDate eventTypes={events}></CalendarChooseDate>
            <TopAttendeesComp></TopAttendeesComp>
            {events &&
              events.map((event, key) => {
                const eventEndDate = new Date(event.end_date);
                const isPastEvent = eventEndDate < currentDate;
                return (
                  <Card
                    className={`p-4 ${
                      isPastEvent ? 'bg-gray-300' : 'bg-white'
                    }`}
                    key={event.event_id}
                  >
                    <div className="pl-3 mb-2">
                      <p className="text-xl text-dark font-bold">
                        {event.event_type}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarTodayIcon className="h-4 w-4 text-gray-500" />
                      <p variant="body2" className="text-gray-500">
                        {formatDate(event.start_date)} -
                        {formatDate(event.end_date)}
                      </p>
                      <AccessTimeIcon className="h-4 w-4 text-gray-500" />
                      <span variant="body2" className="text-gray-500">
                        {event.start_time} - {event.end_time}
                      </span>
                    </div>

                    <CardContent>
                      <p className="">{event.event_descr}</p>
                    </CardContent>
                    <CardActions>
                      <div className="flex items-center gap-2">
                        <LocateIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500 ">{event.location}</span>
                      </div>
                    </CardActions>
                  </Card>
                );
              })}
          </div>
        </div>
      </div>
      <div className="border-l bg-gray-100/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="border-t px-6 py-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
            <div className="mt-4 grid gap-2 animate__animated animate__fadeInRight">
              {events &&
                events
                  .filter((event) => new Date(event.end_date) >= currentDate)
                  .map((event, key) => {
                    return (
                      <div
                        className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-white"
                        key={event.event_id}
                      >
                        <CalendarTodayIcon className="h-4 w-4" />
                        <span>{event.event_type}</span>
                        <span className="ml-auto text-sm">
                          {formatDate(event.start_date)}
                        </span>
                      </div>
                    );
                  })}
            </div>
            <h3 className="text-lg font-medium mt-6">Past Events</h3>
            <div className="mt-4 grid gap-2 animate__animated animate__fadeInRight">
              {events &&
                events
                  .filter((event) => new Date(event.end_date) < currentDate)
                  .map((event, key) => {
                    return (
                      <div
                        className="flex items-center gap-2 rounded-md bg-gray-500 px-3 py-2 text-white"
                        key={event.event_id}
                      >
                        <CalendarTodayIcon className="h-4 w-4" />
                        <span>{event.event_type}</span>
                        <span className="ml-auto text-sm">
                          {formatDate(event.start_date)}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocateIcon(props) {
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
      <line x1="2" x2="5" y1="12" y2="12" />
      <line x1="19" x2="22" y1="12" y2="12" />
      <line x1="12" x2="12" y1="2" y2="5" />
      <line x1="12" x2="12" y1="19" y2="22" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}
