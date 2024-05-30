import Button from '@mui/material/Button';

import { Card, CardHead, CardContent, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function NewEvent() {
  return (
    <div className="grid h-full md:grid-cols-[1fr_280px]">
      <div className="flex flex-col">
        <div className="flex h-[60px] items-center border-b bg-white px-6  ">
          <h2 className="text-lg font-medium">Upcoming Events</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid gap-6 p-6">
            <Card className="p-4 border-l-4 border-blue-500">
              <div className="pl-3 mb-2">
                <p className="text-xl text-dark font-bold">
                  Youth Group Retreat
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CalendarTodayIcon className="h-4 w-4 text-gray-500" />
                <Typography variant="body2" className="text-gray-500">
                  June 10 - June 12, 2023
                </Typography>
                <AccessTimeIcon className="h-4 w-4 text-gray-500" />
                <span variant="body2" className="text-gray-500">
                  5:00 PM - 12:00 PM
                </span>
              </div>

              <CardContent>
                <p>
                  Our youth group is heading out for a weekend retreat to
                  connect, grow, and have fun. Sign up now to reserve your spot!
                </p>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2">
                  <LocateIcon className="h-4 w-4 text-gray-500 " />
                  <span className="text-gray-500 ">
                    Camp Evergreen, Somewhere, USA
                  </span>
                </div>
              </CardActions>
            </Card>
            <Card className="p-4">
              <div className="pl-3 mb-2">
                <p className="text-xl text-dark font-bold">
                  Youth Group Retreat
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CalendarTodayIcon className="h-4 w-4 text-gray-500" />
                <Typography variant="body2" className="text-gray-500">
                  June 10 - June 12, 2023
                </Typography>
                <AccessTimeIcon className="h-4 w-4 text-gray-500" />
                <span variant="body2" className="text-gray-500">
                  5:00 PM - 12:00 PM
                </span>
              </div>

              <CardContent>
                <p>
                  Our youth group is heading out for a weekend retreat to
                  connect, grow, and have fun. Sign up now to reserve your spot!
                </p>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2">
                  <LocateIcon className="h-4 w-4 text-gray-500 " />
                  <span className="text-gray-500 ">
                    Camp Evergreen, Somewhere, USA
                  </span>
                </div>
              </CardActions>
            </Card>
            <Card className="p-4">
              <div className="pl-3 mb-2">
                <p className="text-xl text-dark font-bold">
                  Youth Group Retreat
                </p>
              </div>

              <div className="flex items-center gap-2">
                <CalendarTodayIcon className="h-4 w-4 text-gray-500" />
                <Typography variant="body2" className="text-gray-500">
                  June 10 - June 12, 2023
                </Typography>
                <AccessTimeIcon className="h-4 w-4 text-gray-500" />
                <span variant="body2" className="text-gray-500">
                  5:00 PM - 12:00 PM
                </span>
              </div>

              <CardContent>
                <p>
                  Our youth group is heading out for a weekend retreat to
                  connect, grow, and have fun. Sign up now to reserve your spot!
                </p>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2">
                  <LocateIcon className="h-4 w-4 text-gray-500 " />
                  <span className="text-gray-500 ">
                    Camp Evergreen, Somewhere, USA
                  </span>
                </div>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
      <div className="border-l bg-gray-100/40 ">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <h2 className="text-lg font-medium">Events</h2>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Button
                className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 "
                size="sm"
                variant="ghost"
              >
                <CalendarTodayIcon className="h-4 w-4" />
                Calendar
              </Button>
              <Button
                className="flex w-full items-center justify-start gap-2 rounded-md bg-gray-200 px-3 py-2 text-gray-900 transition-all dark:bg-gray-700 dark:text-gray-50"
                size="sm"
                variant="ghost"
              >
                <ListIcon className="h-4 w-4" />
                Events
              </Button>
              <Button
                className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900 "
                size="sm"
                variant="ghost"
              >
                <PlusIcon className="h-4 w-4" />
                New Event
              </Button>
            </nav>
          </div>
          <div className="border-t px-6 py-4">
            <h3 className="text-lg font-medium">Upcoming Events</h3>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-white">
                <CalendarTodayIcon className="h-4 w-4" />
                <span>Sunday Service</span>
                <span className="ml-auto text-sm">May 28, 2023</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-2 text-gray-900 ">
                <CalendarTodayIcon className="h-4 w-4" />
                <span>Youth Group Retreat</span>
                <span className="ml-auto text-sm">June 10 - June 12, 2023</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-gray-200 px-3 py-2 text-gray-900 ">
                <CalendarTodayIcon className="h-4 w-4" />
                <span>Vacation Bible School</span>
                <span className="ml-auto text-sm">July 10 - July 14, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function ClockIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ListIcon(props) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
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

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
