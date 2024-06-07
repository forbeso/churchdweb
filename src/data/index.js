import React, { useEffect, useState, useContext } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';

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
import ChatButton from '../chat/index';
import { SupabaseContext } from '../SupabaseContext';
import './style.scss';

function Data() {
  const { session, updateSession } = useContext(SupabaseContext);
  const [memberData, setMemberData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [attendanceSun, setAttendanceSundays] = useState([]);

  useEffect(() => {
    async function getAllMembers() {
      setIsLoading(true);
      const { data: members, error } = await supabase
        .from(process.env.DEV_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('type', 'Member');

      const { data: visitors, verror } = await supabase
        .from(process.env.DEV_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('type', 'Visitor');

      const { data: active, active_error } = await supabase
        .from(process.env.DEV_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('status', 'Active');

      const { data: inactive, inactive_error } = await supabase
        .from(process.env.DEV_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .eq('status', 'Inactive');

      const { data: attendanceSundays, attendanceError } = await supabase
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
        .eq('event_type', 'Sunday Service');

      setIsLoading(false);
      setMemberCount(members.length);
      setVisitorCount(visitors.length);
      setActiveCount(active.length);
      setInactiveCount(inactive.length);
      setAttendanceSundays(attendanceSundays);
      console.log(attendanceSundays);
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
    attendanceSun.length > 0
      ? attendanceSun[0].memberAttendance.reduce((countMap, attendance) => {
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
  // Render the line graph

  return (
    <>
      <div>
        <h1>Welcome to Your Dashboard</h1>
        <p>Get insights and manage your church activities with ease.</p>
      </div>
      <div className="d-flex flex-wrap justify-content-between animate__animated animate__fadeIn mb-2">
        <div className="bg-white p-3 chart-container col-12 col-md-6 col-lg-4">
          <h6 className="">Quick Metrics</h6>
          <p className="mb-4">
            <small>Member Summary</small>
          </p>
          <div className="d-flex justify-content-between">
            <div className="metrics p-2 bg-members">
              <div className="card-icon icon-circle circle-member d-flex align-items-center justify-content-center">
                <span className="material-icons-outlined text-white">
                  diversity_3
                </span>
              </div>
              <strong>
                {isLoading ? (
                  <Loader />
                ) : (
                  <h3 className="display-5">{memberCount}</h3>
                )}
              </strong>
              <p>Members</p>
            </div>

            <div className="metrics  p-2 bg-visitors">
              <div className="card-icon icon-circle circle-visitor d-flex align-items-center justify-content-center">
                <span className="material-icons-outlined text-white">
                  diversity_3
                </span>
              </div>
              <strong>
                {isLoading ? <Loader /> : <h3>{visitorCount}</h3>}
              </strong>
              <p>Visitors</p>
            </div>

            <div className="metrics  p-2 bg-active">
              <div className="card-icon icon-circle circle-active d-flex align-items-center justify-content-center">
                <span className="material-icons-outlined text-white">star</span>
              </div>
              <strong>{isLoading ? <Loader /> : <h3>{activeCount}</h3>}</strong>
              <p>Active</p>
            </div>

            <div className="metrics  p-2 bg-inactive">
              <div className="card-icon icon-circle circle-inactive d-flex align-items-center justify-content-center">
                <span className="material-icons-outlined text-white">
                  person_off
                </span>
              </div>
              <strong>
                {isLoading ? <Loader /> : <h3>{inactiveCount}</h3>}
              </strong>
              <p>Inactive</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 chart-container-second col-12 col-md-6 col-lg-4">
          <div>
            <h6>Visitor Insights</h6>
          </div>
          <div>
            <h6>Target vs Reality</h6>
          </div>

          <p className="mb-4">
            <small>Target vs Total Visitors</small>
          </p>

          <div>
            <Bar data={barChartData} />
          </div>
        </div>

        <div className="bg-white p-3 chart-container w-100 col-12 col-lg-6">
          <div>
            <h6>Attendance Insights</h6>
          </div>

          <div>
            <small>Sunday Service</small>
          </div>

          <div>
            <Line
              data={{
                datasets: [
                  {
                    label: 'Attendance',
                    data: attendanceData,
                    borderColor: 'rgb(119,87,254)', // Specify the desired color
                  },
                ],
              }}
              options={options}
            />
          </div>
        </div>

        <div className="bg-white p-3 w-100 col-12 col-lg-6 target-reality">
          <div>
            <h6>Target vs Reality</h6>
          </div>

          <p className="mb-4">
            <small>Target vs Total Visitors</small>
          </p>

          <div>
            <Bar data={barChartData} />
          </div>
        </div>

        <div className="bg-white p-3 target-reality col-12 col-lg-6">
          {/* Content */}
        </div>

        <div className="bg-white p-3 chart-container-second col-12">
          {/* Content */}
        </div>
      </div>
    </>
  );
}

export default Data;
