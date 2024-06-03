import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
} from '@mui/material';

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';

export default function AddNewMemberDialog({ handleToggle }) {
  const [sex, setSex] = useState('');

  return (
    <Dialog open={handleToggle} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex flex-col space-around">
          <p
            className="place-self-end text-red-500 cursor-pointer"
            onClick={handleToggle}
          >
            X
          </p>
          <span className="text-2xl">Add New Member / Visitor</span>
        </div>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Fill out the form to add a new member to the church.
        </Typography>
        <form className="space-y-4 mt-3">
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="member_id"
              variant="outlined"
              disabled
              value={'ALM-DB0001'}
              helperText={'The Member ID is automatically generated.'}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="first name"
                label="First Name"
                placeholder="Enter first name"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="last name"
                label="Last Name"
                placeholder="Enter last name"
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                required
                id="sex"
                name="sex"
                label="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>

              {/* {sexError && (
                <p className="text-danger">This field is required</p>
              )} */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address"
                label="Address line 1"
                placeholder="Enter address"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="country"
                label="Country/Region"
                placeholder="Enter country/region"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                label="City"
                placeholder="Enter city"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              variant="outlined"
            />
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ backgroundColor: '#2F2F2F' }}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
