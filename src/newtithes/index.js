import React, { useState, useEffect } from 'react';
import supabase from '../supabase';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Avatar from 'boring-avatars';
import Button from '@mui/material/Button';
import { TextField, CircularProgress } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function NewTithes() {
  const [members, setMembers] = useState([]);
  const [tithes, setTithes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('Everyone');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: memberData, count } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);

      setTotalMembers(count);
      setMembers(memberData);

      const { data: tithesData } = await supabase.from('tithes').select('*');
      setTithes(tithesData);
      setLoading(false);
    }
    fetchData();
  }, [sortField, sortOrder, page, pageSize, filter]);

  const handleTitheChange = (memberId, date, field, value) => {
    setTithes((prevTithes) => {
      const newTithes = [...prevTithes];
      const titheIndex = newTithes.findIndex(
        (t) => t.member_id === memberId && t.date === date,
      );
      if (titheIndex > -1) {
        newTithes[titheIndex][field] = value;
      } else {
        newTithes.push({ member_id: memberId, date, [field]: value });
      }
      return newTithes;
    });
  };

  const handleSave = async () => {
    for (const tithe of tithes) {
      const { member_id, date, amount_jmd, amount_usd } = tithe;
      await supabase
        .from('tithes')
        .insert({ member_id, date, amount_jmd, amount_usd });
    }
    alert('Tithes saved successfully');
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleSortChange = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredMembers = members.filter((member) => {
    return (
      (filter === 'Everyone' || member.type === filter) &&
      (member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate__animated animate__fadeIn">
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-gray-500 text-sm">Total Tithes</div>
            <div className="text-2xl font-bold">$4,950.00</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-gray-500 text-sm">Total Offerings</div>
            <div className="text-2xl font-bold">$2,000.00</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-gray-500 text-sm">Total Collected</div>
            <div className="text-2xl font-bold">$6,950.00</div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-gray-500 text-sm">Outstanding Balance</div>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* <FilterAndSortMenu
            filters={['Everyone', 'Members', 'Visitors']}
            onFilterChange={handleFilterChange}
          /> */}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate__animated animate__fadeInUp">
        {loading ? (
          <div className="flex justify-center py-10">
            <CircularProgress />
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSortChange('first_name')}>
                    Member
                  </TableCell>
                  <TableCell onClick={() => handleSortChange('type')}>
                    Type
                  </TableCell>
                  <TableCell onClick={() => handleSortChange('status')}>
                    Status
                  </TableCell>
                  <TableCell>Tithe Date</TableCell>
                  <TableCell>J$ Amount</TableCell>
                  <TableCell>US$ Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar
                          size={30}
                          name={member.first_name}
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
                          <div className="font-medium">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.type}</TableCell>
                    <TableCell>{member.status}</TableCell>
                    {['2024-07-07'].map((date) => (
                      <React.Fragment key={date}>
                        <TableCell>
                          <DatePicker
                            placeholderText="Date"
                            selected={
                              tithes.find(
                                (t) =>
                                  t.member_id === member.id && t.date === date,
                              )?.date
                                ? new Date(
                                    tithes.find(
                                      (t) =>
                                        t.member_id === member.id &&
                                        t.date === date,
                                    ).date,
                                  )
                                : null
                            }
                            onChange={(date) =>
                              handleTitheChange(
                                member.id,
                                date ? date.toISOString().split('T')[0] : date,
                                'date',
                                date ? date.toISOString().split('T')[0] : '',
                              )
                            }
                            dateFormat="yyyy-MM-dd"
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={
                              tithes.find(
                                (t) =>
                                  t.member_id === member.id && t.date === date,
                              )?.amount_jmd || ''
                            }
                            onChange={(e) =>
                              handleTitheChange(
                                member.id,
                                date,
                                'amount_jmd',
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={
                              tithes.find(
                                (t) =>
                                  t.member_id === member.id && t.date === date,
                              )?.amount_usd || ''
                            }
                            onChange={(e) =>
                              handleTitheChange(
                                member.id,
                                date,
                                'amount_usd',
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>
                      </React.Fragment>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center py-4">
              <Pagination
                count={Math.ceil(totalMembers / pageSize)}
                page={page}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-8">
        <Button size="sm" variant="outline" onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
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
