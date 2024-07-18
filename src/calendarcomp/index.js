import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextareaAutosize as Textarea,
} from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { Button } from '@mui/base/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Label from '@mui/material/FormLabel';

export default function CalendarChooseDate({ eventTypes }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };
  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDay();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleEventTitleChange = (e) => {
    setEventTitle(e.target.value);
  };
  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };
  const handleEventLocationChange = (e) => {
    setEventLocation(e.target.value);
  };
  const handleEventSubmit = () => {
    console.log('Event Title:', eventTitle);
    console.log('Event Description:', eventDescription);
    console.log('Event Location:', eventLocation);
    console.log('Event Date:', selectedDate);
    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
  };
  return (
    <div className="w-full md:flex md:justify-center">
      <Card className="bg-white rounded-lg shadow-lg p-6 ">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long' })}{' '}
            {currentDate.getFullYear()}
          </div>
          <div className="flex items-center">
            <Button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-950 "
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-950  ml-2"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
            (day, index) => (
              <div
                key={index}
                className="text-center text-gray-500 dark:text-gray-400 font-medium"
              >
                {day}
              </div>
            ),
          )}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={index}
              className="text-center text-gray-300 dark:text-gray-600"
            />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              index + 1,
            );
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();
            return (
              <Button
                key={index}
                onClick={() => handleDateClick(date)}
                className={`text-center rounded-full p-2 hover:bg-gray-100  focus:outline-none focus:ring-2 focus:ring-gray-950  ${
                  isToday
                    ? 'bg-primary text-white  dark:text-gray-950'
                    : isSelected
                    ? 'bg-gray-950 text-white '
                    : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </Button>
            );
          })}
          {Array.from({ length: 6 - lastDayOfMonth }).map((_, index) => (
            <div
              key={index}
              className="text-center text-gray-300 dark:text-gray-600"
            />
          ))}
        </div>
      </Card>
      <div className="flex bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6  md:ml-3">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="event-title" style={{ fontWeight: 500 }}>
              Event Title
            </Label>
            {/* <InputLabel>Event Title</InputLabel> */}
            <Select
              labelId="dropdown-label"
              value={selectedOption}
              onChange={handleChange}
            >
              {eventTypes.map((event) => (
                <MenuItem key={event.event_id} value={event.event_id}>
                  {event.event_type}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-description">Event Description</Label>
            <OutlinedInput
              id="event-description"
              value={eventDescription}
              onChange={handleEventDescriptionChange}
              placeholder="Enter event description"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-location">Event Location</Label>
            <OutlinedInput
              id="event-location"
              value={eventLocation}
              onChange={handleEventLocationChange}
              placeholder="Enter event location"
            />
          </div>
          <Button
            onClick={handleEventSubmit}
            className="bg-purple_look text-white rounded"
          >
            Add Event
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChevronLeftIcon(props) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
