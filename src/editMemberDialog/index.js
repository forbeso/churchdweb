import React, { useContext, useState } from 'react';
import supabase from '../supabase';
import { SupabaseContext } from '../SupabaseContext';
import ConfirmDialog from '../confirmationDialog';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export default function EditMemberDialog({
  selectedMember,
  open,
  handleToggleEditMember,
  setSelectedMember,
  ministryList,
}) {
  const { session } = useContext(SupabaseContext);
  const [seeMoreFormFields, setSeeMoreFormFields] = useState(false);
  const [editErrors, setEditErrors] = useState({
    first_name: false,
    last_name: false,
    address: false,
    city: false,
    sex: false,
    dob: false,
    country_region: false,
    // Add more fields as needed
  });
  const [showMemberInfoDialog, setShowMemberInfoDialog] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');

  const handleEditOnChange = (event) => {
    const { name, value } = event.target;

    setSelectedMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));

    setEditErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false, // Clear the error for the current field
    }));
  };

  const handleOpenInfoDialog = () => {
    const { first_name, last_name, address, city, sex, dob, country_region } =
      selectedMember || {};

    const errors = {
      first_name: !first_name,
      last_name: !last_name,
      address: !address,
      city: !city,
      sex: !sex,
      dob: !dob,
      country_region: !country_region,
      // Add more fields as needed
    };

    setEditErrors(errors);

    // Check if there are any errors before showing the dialog
    if (!Object.values(errors).some((error) => error)) {
      setShowMemberInfoDialog(true);
    }
  };

  const handleCloseInfoDialog = () => {
    setShowMemberInfoDialog(false);
  };

  const handleConfirmUpdate = async () => {
    const { data, error } = await supabase
      .from(process.env.REACT_APP_MEMBERVIS_TABLE)
      .update(selectedMember)
      .match({ member_id: selectedMember.member_id });

    if (error) {
      setConfirmError(true);
      setConfirmMsg(
        `Error updating ${selectedMember.first_name}'s information`,
      );
      toast.error('Error updating record:', error.message);
    } else {
      setConfirmError(false);
      setConfirmMsg(
        `Successfully updated ${selectedMember.first_name}'s information`,
      );
      toast.success(
        `Successfully updated ${selectedMember.first_name}'s information`,
      );
    }

    // Close the edit dialog regardless of success or failure
    handleCloseInfoDialog();
    handleToggleEditMember();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        <div className="flex flex-col space-around">
          <p
            className="place-self-end text-red-500 cursor-pointer"
            onClick={handleToggleEditMember}
          >
            X
          </p>
          <span className="text-2xl">Edit Member</span>
        </div>
      </DialogTitle>

      <DialogContent>
        <p variant="body1" color="textSecondary">
          Fill out the form to edit member information.
        </p>
        <form className="space-y-4 mt-3">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="first_name"
                name="first_name"
                value={selectedMember.first_name ?? ''}
                label="First Name"
                placeholder="Enter first name"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.first_name}
                helperText={
                  editErrors.first_name ? 'First name is required' : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="last_name"
                name="last_name"
                label="Last Name"
                value={selectedMember.last_name ?? ''}
                placeholder="Enter last name"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.last_name}
                helperText={editErrors.last_name ? 'Last name is required' : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={selectedMember.email ?? ''}
                placeholder="Enter email address"
                variant="outlined"
                onChange={handleEditOnChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="dob"
                name="dob"
                type="date"
                value={selectedMember.dob ?? ''}
                label="Date of Birth"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.dob}
                helperText={editErrors.dob ? 'Date of birth is required' : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="ministry-label">Type</InputLabel>
                <Select
                  label="type"
                  name="type"
                  value={selectedMember.type ?? ''}
                  onChange={handleEditOnChange}
                  fullWidth
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Visitor">Visitor</MenuItem>
                </Select>
              </FormControl>
              {/* {sexError && (
                <p className="text-danger">This field is required</p>
              )} */}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="sex-label">Sex</InputLabel>
                <Select
                  labelId="sex-label"
                  id="sex"
                  name="sex"
                  value={selectedMember.sex ?? ''}
                  onChange={handleEditOnChange}
                  error={editErrors.sex}
                >
                  <MenuItem value="">Select Sex</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                value={selectedMember.address ?? ''}
                placeholder="Enter address"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.address}
                helperText={editErrors.address ? 'Address is required' : ''}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="country_region"
                name="country_region"
                label="Country/Region"
                value={selectedMember.country_region ?? ''}
                placeholder="Enter country/region"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.country_region}
                helperText={
                  editErrors.country_region ? 'Country/Region is required' : ''
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={selectedMember.city ?? ''}
                placeholder="Enter city"
                variant="outlined"
                onChange={handleEditOnChange}
                error={editErrors.city}
                helperText={editErrors.city ? 'City is required' : ''}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="mobile_phone"
                label="Phone Number"
                value={selectedMember.mobile_phone ?? ''}
                placeholder="Enter phone number"
                variant="outlined"
                onChange={handleEditOnChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="ministry-label">Ministry</InputLabel>
                <Select
                  labelId="ministry-label"
                  id="ministry"
                  name="ministry"
                  value={selectedMember.ministry ?? ''}
                  onChange={handleEditOnChange}
                >
                  <MenuItem value="">Select Ministry</MenuItem>
                  {ministryList &&
                    ministryList.map((ministry, index) => (
                      <MenuItem key={index} value={ministry.name}>
                        {ministry.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <p
            className="text-right underline cursor-pointer text-sm"
            onClick={() => setSeeMoreFormFields(!seeMoreFormFields)}
          >
            Add more details
          </p>

          {seeMoreFormFields && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  fullWidth
                  id="zip"
                  name="zip_postal_code"
                  label="Zip/Postal Code"
                  placeholder="Enter 5 digit Zip"
                  variant="outlined"
                  value={selectedMember.zip_postal_code ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="notes"
                  name="notes"
                  label="Notes"
                  value={selectedMember.notes}
                  placeholder="Enter any notes related to this person"
                  variant="outlined"
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="physician_name"
                  name="physician_name"
                  label="Physician's Name"
                  placeholder="Enter Physician's Name"
                  variant="outlined"
                  value={selectedMember.physician_name ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="physician_phone"
                  name="physician_phone"
                  label="Physician's Phone"
                  placeholder="Enter Physician's Phone"
                  variant="outlined"
                  value={selectedMember.physician_phone ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="allergies"
                  name="allergies"
                  label="Allergies"
                  placeholder="Enter any allergies..."
                  variant="outlined"
                  value={selectedMember.allergies ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="medications"
                  name="medications"
                  label="Medications"
                  placeholder="list them seperated by a comma"
                  variant="outlined"
                  value={selectedMember.medications ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insurance carrier"
                  name="insurance_carrier"
                  label="Insurance Carrier"
                  placeholder="Enter carrier's name"
                  value={selectedMember.insurance_carrier ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insurance_number"
                  name="insurance_number"
                  label="Insurance Number"
                  placeholder="Enter number"
                  variant="outlined"
                  value={selectedMember.insurance_number ?? ''}
                  onChange={handleEditOnChange}
                />
              </Grid>
            </Grid>
          )}
        </form>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          fullWidth
          style={{ backgroundColor: '#2F2F2F' }}
          onClick={handleOpenInfoDialog}
        >
          Update Record
        </Button>

        <ConfirmDialog
          selectedMember={selectedMember}
          showDialog={showMemberInfoDialog}
          handleCloseInfoDialog={handleCloseInfoDialog}
          handleConfirm={handleConfirmUpdate}
        />
      </DialogActions>
    </Dialog>
  );
}
