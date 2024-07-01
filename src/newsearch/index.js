import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@mui/base/Input';
import { Button, Card, Typography as CardTitle } from '@mui/material';
import FilterAndSortMenu from '../filtersearch.js';
import Avatar from 'boring-avatars';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import Loader from '../loader.js';
import AddNewMemberDialog from '../addNewMemberDialog/index.js';
import EditMemberDialog from '../editMemberDialog/index.js';

export default function NewSearch() {
  const { session } = useContext(SupabaseContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState(['Everyone']); // Initialize with default filter
  const [sortBy, setSortBy] = useState('lastname');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [loggedIn, setLoggedin] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ministryList, setMinistryList] = useState([]);

  useEffect(() => {
    const user = session?.user;

    if (!session) {
      navigate('/');
    } else {
      setLoggedin(true);
    }

    async function getAllMembers() {
      setIsLoading(true);
      const { data: membervis, error } = await supabase
        .from(process.env.REACT_APP_MEMBERVIS_TABLE)
        .select('*');
      setIsLoading(false);
      setMemberData(membervis);
    }

    getAllMembers();

    async function getMinistries() {
      const { data: ministry, error } = await supabase
        .from('ministry')
        .select('name');
      setMinistryList(ministry);
    }

    getMinistries();
  }, [navigate, session, session?.user]);

  const handleSelectedMember = (member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleToggleEditMember = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleToggleNewMemberDialog = () => {
    setIsNewMemberDialogOpen(!isNewMemberDialogOpen);
  };

  const handleOnChange = (query) => {
    setSearchQuery(query.target.value);
    const filteredMembers = memberData.filter((member) => {
      const memberFullName = `${member.first_name} ${member.last_name}`;
      return memberFullName
        .toLowerCase()
        .includes(query.target.value.toLowerCase());
    });

    setSearchResults(filteredMembers);
  };

  const handleFilterChange = (newFilters) => {
    //console.log('New Filters:', newFilters); // Debugging log
    setFilters(newFilters);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const filterMembers = (members) => {
    if (filters.includes('Everyone')) {
      return members;
    }
    return members.filter((member) => {
      if (filters.includes('Members') && member.type === 'Member') {
        return true;
      }
      if (filters.includes('Visitors') && member.type === 'Visitor') {
        return true;
      }
      return false;
    });
  };

  const sortMembers = (members) => {
    return (
      members &&
      members.slice().sort((a, b) => {
        if (sortBy === 'firstname') {
          return a.first_name.localeCompare(b.first_name);
        }
        if (sortBy === 'lastname') {
          return a.last_name.localeCompare(b.last_name);
        }
        if (sortBy === 'email') {
          return a.email?.localeCompare(b.email);
        }

        if (sortBy === 'status') {
          return a.status?.localeCompare(b.status);
        }
        if (sortBy === 'date') {
          return new Date(b.date_joined) - new Date(a.date_joined);
        }
        return 0;
      })
    );
  };

  const membersToDisplay = searchQuery ? searchResults : memberData;
  const filteredMembers = filterMembers(membersToDisplay);
  const sortedMembers = sortMembers(filteredMembers);

  //console.log('Filtered Members:', filteredMembers); // Debugging log

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {isNewMemberDialogOpen && (
        <AddNewMemberDialog
          handleToggle={handleToggleNewMemberDialog}
          memberData={memberData}
          ministryList={ministryList}
        ></AddNewMemberDialog>
      )}

      {selectedMember && (
        <EditMemberDialog
          selectedMember={selectedMember}
          open={isDialogOpen}
          handleToggleEditMember={handleToggleEditMember}
          setSelectedMember={setSelectedMember}
          ministryList={ministryList}
        ></EditMemberDialog>
      )}

      <h1 className="mb-6 text-3xl font-bold md:mb-8 md:text-4xl">
        Member Directory
      </h1>
      <p className="mb-6 text-gray-500">
        Explore your directory of members and connect with the community.
      </p>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
        <input
          className="w-5/12 h-10 rounded p-2"
          placeholder="Search members..."
          type="text"
          value={searchQuery}
          onChange={handleOnChange}
        />
        <div className="flex items-center gap-4">
          <FilterAndSortMenu
            filters={['Everyone', 'Members', 'Visitors']}
            defaultSort="lastname"
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>
        <div>
          <Button
            className="text-white"
            onClick={handleToggleNewMemberDialog}
            style={{ backgroundColor: '#65A20C' }}
          >
            Grow my flock
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <Loader />
        ) : (
          sortedMembers.map((member) => (
            <Card
              className="flex flex-col animate__animated animate__fadeIn cursor-pointer hover:border hover:border-2 hover:border-[#516AC8]"
              key={member.member_id}
              onClick={() => handleSelectedMember(member)}
            >
              <div className="flex items-center gap-4 p-4">
                <Avatar
                  size={40}
                  name={member.member_id}
                  variant="beam"
                  colors={[
                    '#0A0310',
                    '#49007E',
                    '#FF7D10',
                    '#0C8F8F',
                    '#FFB238',
                  ]}
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {member.first_name} {member.last_name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {member.email}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {member.status}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
