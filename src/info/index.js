import React, { useState, useEffect, useContext } from 'react';
import supabase from '../supabase';
import Button from '@mui/material/Button';
import { SupabaseContext } from '../SupabaseContext';
import {
  TextField,
  Card,
  CardContent,
  CardActionArea,
  CardHeader,
  Typography,
} from '@mui/material';
import './style.scss';

function Info() {
  const { session } = useContext(SupabaseContext);
  const [churchDetails, setChurchDetails] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchChurchDetails = async () => {
      const { data, error } = await supabase
        .from('church_details')
        .select('*')
        .eq('id', 1) // Assuming you are using 'id' to fetch the details. Adjust as necessary.
        .single();

      if (error) {
        console.error('Error fetching church details:', error);
      } else {
        setChurchDetails(data);
      }
    };

    fetchChurchDetails();
  }, []);

  const handleChange = (field, value) => {
    setChurchDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const { name, address, phone, email } = churchDetails;

    const { error } = await supabase
      .from('church_details')
      .upsert({ id: 1, name, address, phone, email }); // Adjust as necessary.

    if (error) {
      console.error('Error updating church details:', error);
    } else {
      alert('Church details saved successfully');
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader
          title="Church Details"
          subheader="Update your church's name, address, and contact information."
        />
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Church Name</span>
                <TextField
                  value={churchDetails.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Address</span>
                <TextField
                  value={churchDetails.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <TextField
                  value={churchDetails.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Email</span>
                <TextField
                  value={churchDetails.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardActionArea className="p-3">
          <Button
            variant="outlined"
            className="bg-dark text-white"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default Info;

function PenIcon(props) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}
