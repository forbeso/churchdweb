import React, { useState } from 'react';

import FilterAndSortMenu from '../filtersearch';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Avatar from 'boring-avatars';
import Button from '@mui/material/Button';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function NewTithes() {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100  rounded-lg p-4">
            <div className="text-gray-500  text-sm">Total Tithes</div>
            <div className="text-2xl font-bold">$4,950.00</div>
          </div>
          <div className="bg-gray-100  rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Total Offerings
            </div>
            <div className="text-2xl font-bold">$2,000.00</div>
          </div>
          <div className="bg-gray-100  rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Total Collected
            </div>
            <div className="text-2xl font-bold">$6,950.00</div>
          </div>
          <div className="bg-gray-100  rounded-lg p-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Outstanding Balance
            </div>
            <div className="text-2xl font-bold">$0.00</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-6 mt-8">
        <h1 className="text-2xl font-bold">Tithes and Offerings</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 " />
            <input
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
              placeholder="Search members"
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <FilterAndSortMenu
              filters={['Everyone', 'Members', 'Visitors']}
            ></FilterAndSortMenu>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Total Tithes</TableCell>
              <TableCell>Total Offerings</TableCell>
              <TableCell>Last Contribution</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className="bg-green-100 ">
              <TableCell>
                <div className="flex items-center gap-4">
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
                  <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-gray-500  text-sm">
                      johndoe@example.com
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-green-600 font-medium">
                $1,200.00
              </TableCell>
              <TableCell className="text-green-600  font-medium">
                $500.00
              </TableCell>
              <TableCell className="text-green-600  font-medium">
                2023-04-15
              </TableCell>
            </TableRow>
            <TableRow className="bg-yellow-100">
              <TableCell>
                <div className="flex items-center gap-4">
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
                  <div>
                    <div className="font-medium">Jane Appleseed</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      janeappleseed@example.com
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-yellow-600  font-medium">
                $800.00
              </TableCell>
              <TableCell className="text-yellow-600  font-medium">
                $300.00
              </TableCell>
              <TableCell className="text-yellow-600  font-medium">
                2023-05-01
              </TableCell>
            </TableRow>
            <TableRow className="bg-red-100">
              <TableCell>
                <div className="flex items-center gap-4">
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
                  <div>
                    <div className="font-medium">Sarah Murphy</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      sarahmurphy@example.com
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-red-600  font-medium">
                $950.00
              </TableCell>
              <TableCell className="text-red-600  font-medium">
                $400.00
              </TableCell>
              <TableCell className="text-red-600  font-medium">
                2023-04-30
              </TableCell>
            </TableRow>
            <TableRow className="bg-blue-100">
              <TableCell>
                <div className="flex items-center gap-4">
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
                  <div>
                    <div className="font-medium">Michael Johnson</div>
                    <div className="text-gray-500  text-sm">
                      michaeljohnson@example.com
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                $1,100.00
              </TableCell>
              <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                $450.00
              </TableCell>
              <TableCell className="text-blue-600 dark:text-blue-400 font-medium">
                2023-05-10
              </TableCell>
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableCell>
                <div className="flex items-center gap-4">
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
                  <div>
                    <div className="font-medium">Emily Wilson</div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      emilywilson@example.com
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400 font-medium">
                $900.00
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400 font-medium">
                $350.00
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400 font-medium">
                2023-05-05
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline">
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button size="sm" variant="outline">
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">
            Showing 1-5 of 20 results
          </span>
          <FormControl variant="outlined" size="small">
            <InputLabel id="simple-select-label">Options</InputLabel>
            <Select
              labelId="simple-select-label"
              id="simple-select"
              value={value}
              onChange={handleChange}
              label="#"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );
}

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
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

function FilterIcon(props) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
