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
  Box,
  Container,
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
        .eq('id', 1)
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
      .upsert({ id: 1, name, address, phone, email });

    if (error) {
      console.error('Error updating church details:', error);
    } else {
      alert('Church details saved successfully');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card elevation={0} sx={{ borderRadius: '16px', bgcolor: '#fff' }}>
          <CardHeader
            title={
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}
              >
                Church Details
              </Typography>
            }
            subheader={
              <Typography variant="body1" color="text.secondary">
                Update your church's name, address, and contact information.
              </Typography>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                    Church Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={churchDetails.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    variant="outlined"
                    placeholder="Enter church name"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                    Address
                  </Typography>
                  <TextField
                    fullWidth
                    value={churchDetails.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    variant="outlined"
                    placeholder="Enter address"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                    Phone
                  </Typography>
                  <TextField
                    fullWidth
                    value={churchDetails.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    variant="outlined"
                    placeholder="Enter phone number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    value={churchDetails.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    variant="outlined"
                    placeholder="Enter email address"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSaveChanges}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                bgcolor: '#1a1a1a',
                '&:hover': {
                  bgcolor: '#333',
                },
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
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
