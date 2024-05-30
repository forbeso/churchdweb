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
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="mb-6 text-3xl font-bold  md:text-4xl">
        Your Member Dashboard
      </h1>
      <p className="mb-6 text-gray-500">
        Explore our directory of members and connect with the community.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Total Members</p>
            <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +5.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between pb-2 pl-3">
            <p className="text-sm font-medium">Upcoming Events</p>
            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
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
          <CardContent></CardContent>
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
