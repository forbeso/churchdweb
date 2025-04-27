import { useState } from 'react';
import { Card, Typography, OutlinedInput } from '@mui/material';
import { Button } from '@mui/base/Button';
import Label from '@mui/material/FormLabel';
import supabase from '../supabase';

export default function CalendarChooseDate({ eventTypes }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [dateError, setDateError] = useState('');

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setDateError(''); // Clear date error when a date is selected
  };

  const handleEventTitleChange = (e) => {
    setEventTitle(e.target.value);
    setTitleError(''); // Clear title error on change
  };

  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
    setDescriptionError(''); // Clear description error on change
  };

  const handleEventLocationChange = (e) => {
    setEventLocation(e.target.value);
    setLocationError(''); // Clear location error on change
  };

  const handleEventSubmit = async () => {
    let isValid = true;

    if (!eventTitle) {
      setTitleError('Event title is required');
      isValid = false;
    }
    if (!eventDescription) {
      setDescriptionError('Event description is required');
      isValid = false;
    }
    if (!eventLocation) {
      setLocationError('Event location is required');
      isValid = false;
    }
    if (!selectedDate) {
      setDateError('Event date is required');
      isValid = false;
    }

    if (!isValid) return;

    const isoDate = selectedDate.toISOString().split('T')[0];

    const { data, error } = await supabase.from('events').insert([
      {
        event_type: eventTitle,
        event_descr: eventDescription,
        location: eventLocation,
        start_date: isoDate,
        end_date: isoDate,
      },
    ]);

    if (error) {
      //console.error('Error adding event:', error);
      alert('Error adding event.')
    } else {
      //console.log('Event added successfully:', data);
      alert('Event added successfully.')
    }

    setEventTitle('');
    setEventDescription('');
    setEventLocation('');
    setSelectedDate(new Date()); // Reset date
  };

  return (
    <div className="w-full md:flex md:justify-center">
      <Card className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            {currentDate.toLocaleString('default', { month: 'long' })}{' '}
            {currentDate.getFullYear()}
          </div>
          <div className="flex items-center">
            <Button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 ml-2"
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
                className={`text-center rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 ${
                  isToday
                    ? 'bg-blue-500 text-white'
                    : isSelected
                    ? 'bg-blue-500 text-white'
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
      <div className="flex bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 md:ml-3">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="event-title" style={{ fontWeight: 500 }}>
              Event Title
            </Label>
            <OutlinedInput
              id="event-title"
              value={eventTitle}
              onChange={handleEventTitleChange}
              placeholder="Enter event title"
              error={!!titleError}
            />
            {titleError && (
              <Typography color="error" variant="body2">
                {titleError}
              </Typography>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-description">Event Description</Label>
            <OutlinedInput
              id="event-description"
              value={eventDescription}
              onChange={handleEventDescriptionChange}
              placeholder="Enter event description"
              rows={3}
              error={!!descriptionError}
            />
            {descriptionError && (
              <Typography color="error" variant="body2">
                {descriptionError}
              </Typography>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="event-location">Event Location</Label>
            <OutlinedInput
              id="event-location"
              value={eventLocation}
              onChange={handleEventLocationChange}
              placeholder="Enter event location"
              error={!!locationError}
            />
            {locationError && (
              <Typography color="error" variant="body2">
                {locationError}
              </Typography>
            )}
          </div>
          <Button
            onClick={handleEventSubmit}
            className="bg-purple_look text-white rounded"
          >
            Add Event
          </Button>
          {dateError && (
            <Typography color="error" variant="body2">
              {dateError}
            </Typography>
          )}
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
