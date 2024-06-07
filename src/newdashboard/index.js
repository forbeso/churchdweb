import React, { useEffect, useState, useContext } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import supabase from '../supabase';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  LineElement,
  TimeScale,
  PointElement,
} from 'chart.js';
import Loader from '../loader';
import { SupabaseContext } from '../SupabaseContext';

import {
  UsersIcon,
  CalendarIcon,
  DollarSignIcon,
  BarChartIcon,
} from '../assets/icons/svgs';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import Avatar from 'boring-avatars';

export default function NewDashboard() {
  const { session, updateSession } = useContext(SupabaseContext);
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [attendanceTo, setAttendanceTo] = useState([]);

  useEffect(() => {
    async function getAllMembers() {
      setIsLoading(true);
      const { data: members, error } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('type', 'Member');

      const { data: visitors, verror } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('type', 'Visitor');

      const { data: active, active_error } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('status', 'Active');

      const { data: inactive, inactive_error } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('status', 'Inactive');

      const { data: attendance, attendanceError } = await supabase
        .from('events')
        .select(
          `
      event_id,
      event_type,
      start_date,
      start_time,
      memberAttendance ( event_id, attendance_date, attendance_time, member_id )
    `,
        )
        .in('event_type', ['Sunday Service', 'Bible Study']);

      setIsLoading(false);
      setMemberCount(members.length);
      setVisitorCount(visitors.length);
      setActiveCount(active.length);
      setInactiveCount(inactive.length);
      setAttendanceTo(attendance);
      console.log(attendance);
    }
    getAllMembers();
  }, []);

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    TimeScale,
    PointElement,
  );

  const doughnutData = {
    labels: ['Members', 'Visitors'],
    datasets: [
      {
        label: 'Count: ',
        data: [memberCount, visitorCount],
        backgroundColor: ['#ff8080', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const target_reality = [
    {
      Jan: { target: 100, reality: 20 },
      Feb: { target: 150, reality: 70 },
      Mar: { target: 200, reality: 120 },
      Apr: { target: 100, reality: 20 },
      May: { target: 150, reality: 70 },
      June: { target: 200, reality: 120 },
    },
  ];

  // Extracting the months from the target_reality data
  const months = Object.keys(target_reality[0]);

  // Extracting the target and reality values for each month
  const targets = months.map((month) => target_reality[0][month].target);
  const realities = months.map((month) => target_reality[0][month].reality);

  // Use these arrays to create the bar chart
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: 'Target',
        data: targets,
        backgroundColor: '#feca57', // Customize the background color for the target bars
        //borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reality',
        data: realities,
        backgroundColor: '#43aa8b', // Customize the background color for the reality bars
        //borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const activeStatusData = {
    labels: ['Target', 'Reality'],
    datasets: [
      {
        label: 'Member Status Count',
        data: [target_reality[0].Jan.target, target_reality[0].Jan.reality],
        backgroundColor: ['rgba(254,119,87,0.7)', 'rgba(196, 196, 196,0.7)'],
        borderWidth: 0,
      },
    ],
  };

  // Prepare the line graph data
  const data =
    attendanceTo.length > 0
      ? attendanceTo[0].memberAttendance.reduce((countMap, attendance) => {
          const { attendance_date } = attendance;
          if (countMap.has(attendance_date)) {
            countMap.set(attendance_date, countMap.get(attendance_date) + 1);
          } else {
            countMap.set(attendance_date, 1);
          }
          return countMap;
        }, new Map())
      : new Map();

  const bible_study =
    attendanceTo.length > 0
      ? attendanceTo[1].memberAttendance.reduce((countMap, attendance) => {
          const { attendance_date } = attendance;
          if (countMap.has(attendance_date)) {
            countMap.set(attendance_date, countMap.get(attendance_date) + 1);
          } else {
            countMap.set(attendance_date, 1);
          }
          return countMap;
        }, new Map())
      : new Map();

  const attendanceData = Array.from(data.entries()).map(([date, count]) => ({
    x: date,
    y: count,
  }));

  const bibleStudyAttendance = Array.from(bible_study.entries()).map(
    ([date, count]) => ({
      x: date,
      y: count,
    }),
  );

  // Prepare the line graph options
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Attendance Count',
        },
        ticks: {
          stepSize: 1, // Display whole numbers only
        },
      },
    },
  };
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="mb-6 text-3xl font-bold  md:text-4xl">
        Your Member Dashboard
      </h1>
      <p className="mb-6 text-gray-500">
        Explore your church data in one place.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 animate__animated animate__fadeIn">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Total Members</p>
            <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">
              {' '}
              {isLoading ? <Loader /> : <h3>{memberCount}</h3>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +5.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Total Visitors</p>
            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader /> : <h3>{visitorCount}</h3>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Recent Donations</p>
            <DollarSignIcon className="w-4 h-4 text-gray-500 " />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">$15,234</div>
            <p className="text-xs text-gray-500 ">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Membership Growth</p>
            <BarChartIcon className="w-4 h-4 text-gray-500 " />
          </div>
          <CardContent>
            {' '}
            <div>
              <Bar data={barChartData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Recent Donations</p>
            <DollarSignIcon className="w-4 h-4 text-gray-500" />
          </div>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>$100</TableCell>
                  <TableCell>2023-05-01</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>$50</TableCell>
                  <TableCell>2023-04-28</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Michael Johnson</TableCell>
                  <TableCell>$75</TableCell>
                  <TableCell>2023-04-25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sarah Lee</TableCell>
                  <TableCell>$25</TableCell>
                  <TableCell>2023-04-22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>David Kim</TableCell>
                  <TableCell>$150</TableCell>
                  <TableCell>2023-04-18</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Attendance Insights</p>
            <CalendarIcon className="w-4 h-4 text-gray-500" />
          </div>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Line
                  data={{
                    datasets: [
                      {
                        label: 'Sunday Service',
                        data: attendanceData,
                        borderColor: 'rgb(119,87,254)',
                      },
                      {
                        label: 'Bible Study',
                        data: bibleStudyAttendance,
                        borderColor: 'rgb(255,125,16)',
                      },
                    ],
                  }}
                  options={options}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Recent Donations</p>
            <DollarSignIcon className="w-4 h-4 text-gray-500" />
          </div>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Donor</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>$100</TableCell>
                  <TableCell>2023-05-01</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell>$50</TableCell>
                  <TableCell>2023-04-28</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Michael Johnson</TableCell>
                  <TableCell>$75</TableCell>
                  <TableCell>2023-04-25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sarah Lee</TableCell>
                  <TableCell>$25</TableCell>
                  <TableCell>2023-04-22</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>David Kim</TableCell>
                  <TableCell>$150</TableCell>
                  <TableCell>2023-04-18</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">Upcoming Events</p>
            <CalendarIcon className="w-4 h-4 text-gray-500" />
          </div>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="grid gap-1">
                  <div className="font-medium">Worship Service</div>
                  <div className="text-xs text-gray-500">
                    May 28, 2023 - 10:00 AM
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="grid gap-1">
                  <div className="font-medium">Youth Group Meeting</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    June 2, 2023 - 7:00 PM
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 rounded-md flex items-center justify-center aspect-square w-10 md:w-12">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="grid gap-1">
                  <div className="font-medium">Potluck Dinner</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    June 10, 2023 - 6:00 PM
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <p className="text-sm font-medium">New Members</p>
            <UsersIcon className="w-4 h-4 text-gray-500 " />
          </div>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar
                  size={30}
                  name="Maria Mitchell"
                  variant="marble"
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90',
                  ]}
                />
                <div className="grid gap-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined on May 15, 2023
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar
                  size={30}
                  name="Maria Mitchell"
                  variant="marble"
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90',
                  ]}
                />
                <div className="grid gap-1">
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined on May 20, 2023
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Avatar
                  size={30}
                  name="Maria Mitchell"
                  variant="marble"
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90',
                  ]}
                />
                <div className="grid gap-1">
                  <div className="font-medium">Michael Johnson</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined on May 25, 2023
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Avatar
                  size={30}
                  name="Maria Mitchell"
                  variant="marble"
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90',
                  ]}
                />
                <div className="grid gap-1">
                  <div className="font-medium">Michael Johnson</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined on May 25, 2023
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Avatar
                  size={30}
                  name="Maria Mitchell"
                  variant="marble"
                  colors={[
                    '#92A1C6',
                    '#146A7C',
                    '#F0AB3D',
                    '#C271B4',
                    '#C20D90',
                  ]}
                />
                <div className="grid gap-1">
                  <div className="font-medium">Michael Johnson</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Joined on May 25, 2023
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BarChart(props) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          { name: 'Jan', count: 111 },
          { name: 'Feb', count: 157 },
          { name: 'Mar', count: 129 },
          { name: 'Apr', count: 150 },
          { name: 'May', count: 119 },
          { name: 'Jun', count: 72 },
        ]}
        keys={['count']}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={['#2563eb']}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: '9999px',
            },
            container: {
              fontSize: '12px',
              textTransform: 'capitalize',
              borderRadius: '6px',
            },
          },
          grid: {
            line: {
              stroke: '#f3f4f6',
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function LineChartIcon(props) {
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
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}
