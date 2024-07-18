import React, { useEffect, useState, useContext, ChangeEvent } from 'react';
import supabase from '../supabase';

import { SupabaseContext } from '../SupabaseContext';
import { toast } from 'react-toastify';

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

export default function AddNewMemberDialog({
  handleToggle,
  memberData,
  ministryList,
}) {
  const { session } = useContext(SupabaseContext);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [emailAd, setEmail] = useState('');
  const [memberId, setMemberId] = useState('');
  const [ministry, setMinistry] = useState('');
  const [sex, setSex] = useState(['male']);
  const [date_of_birth, setDob] = useState('');
  const [homePhone, setHomePhone] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [addressL1, setAddress] = useState('');
  const [cityAd, setCity] = useState('');
  const [stateProvince, setStateProvince] = useState('Florida');
  const [zipPostalCode, setZipPostalCode] = useState('');
  const [countryRegion, setCountryRegion] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');
  const [status, setStatus] = useState('');
  const [physicianName, setPhysicianName] = useState('');
  const [physicianPhone, setPhysicianPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [insuranceCarrier, setInsuranceCarrier] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [type, setType] = useState(['']);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [ministryError, setMinistryError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [sexError, setSexError] = useState(false);
  const [cityError, setCityAdError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [dobError, setDOBError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [addError, setAddError] = useState(false);
  const [addResponseMessage, setAddResponseMessage] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [seeMoreFormFields, setSeeMoreFormFields] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');

  function createUniqueID(fn, ln) {
    if (!memberId) {
      const firstInitial = fn.charAt(0).toUpperCase();
      const lastInitial = ln.charAt(0).toUpperCase();
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      const id = `ALM-${firstInitial}${lastInitial}-${randomNumber}`;

      setMemberId(id);
    }
  }

  const handleSelectSex = (e) => {
    const newSex = e.target.value;
    setSex(newSex);
  };

  const handleAddMember = async () => {
    // Check if required fields are empty and set error state variables accordingly
    if (!firstName) {
      setFirstNameError(true);
    }
    if (!lastName) {
      setLastNameError(true);
    }

    if (!sex) {
      setSexError(true);
    }

    // if (!date_of_birth) {
    //   setDOBError(true);
    // }

    if (!cityAd) {
      setCityAdError(true);
    }

    if (!countryRegion) {
      setCountryError(true);
    }

    if (!addressL1) {
      setAddressError(true);
    }
    // Add more error checks for each required input field

    // Only insert data if all required fields are filled out
    // if (firstName && lastName) {
    //   createUniqueID(firstName, lastName);
    // }

    if (firstName && lastName && date_of_birth) {
      const isDuplicate = memberData.some(
        (item) =>
          item.first_name === firstName &&
          item.last_name === lastName &&
          item.dob === date_of_birth,
      );
      if (!isDuplicate) {
        const { data, error } = await supabase
          .from(process.env.REACT_APP_MEMBERVIS_TABLE)
          .insert([
            {
              member_id: memberId,
              first_name: firstName,
              last_name: lastName,
              ministry: ministry,
              sex: sex,
              email: emailAd,
              dob: date_of_birth,
              home_phone: homePhone,
              mobile_phone: mobilePhone,
              address: addressL1,
              city: cityAd,
              state_province: stateProvince,
              zip_postal_code: zipPostalCode,
              country_region: countryRegion,
              notes: notes,
              attachments: attachments,
              physician_name: physicianName,
              physician_phone: physicianPhone,
              allergies: allergies,
              medications: medications,
              insurance_carrier: insuranceCarrier,
              insurance_number: insuranceNumber,
              type: type,
            },
          ])
          .select();

        if (error) {
          console.log(error);

          setAddError(true);
          setAddSuccess(false);
          let msg = '';
          if (error.message === 'invalid input syntax for type date: ""') {
            msg = 'Please check the date of birth selection again.';
          } else {
            msg = error.message;
          }
          setAddResponseMessage(msg);
        }
        if (data) {
          const msg = `Congrats, ${firstName} is now apart of your church family.`;

          if (addError) {
            setAddError(false);
          }
          setAddSuccess(true);
          setAddResponseMessage(msg);
        }
      } else {
        setDuplicateError(
          `It seems you have already added ${firstName} ${lastName} to your church`,
        );
      }

      addResponseMessage && toast.success(addResponseMessage);
      duplicateError && toast.error(duplicateError);
      addError && toast.error(addResponseMessage);
    }
  };

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
        <p variant="body1" color="textSecondary">
          Fill out the form to add a new member to the church.
        </p>
        <form className="space-y-4 mt-3">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="first name"
                label="First Name"
                placeholder="Enter first name"
                variant="outlined"
                helperText={firstNameError && 'First name is required'}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="last name"
                label="Last Name"
                placeholder="Enter last name"
                variant="outlined"
                helperText={lastNameError && 'Last name is required'}
                FormHelperTextProps={{ color: 'red' }}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="member_id"
              variant="outlined"
              value={memberId}
              helperText={'Click to generate Member ID.'}
              onFocus={() => createUniqueID(firstName, lastName)}
            />
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                placeholder="Enter email address"
                variant="outlined"
                helperText={emailError && 'Email is required'}
                FormHelperTextProps={{ color: '#d50000' }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="dob"
                type="date"
                label=""
                //placeholder="Enter DOB"
                variant="outlined"
                onChange={(e) => setDob(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="ministry-label">Type</InputLabel>
                <Select
                  label="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  label="type"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Left Church">Left Church</MenuItem>
                  <MenuItem value="Migrated">Migrated</MenuItem>
                  <MenuItem value="Deceased">Deceased</MenuItem>
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
                <InputLabel id="ministry-label">Sex</InputLabel>
                <Select
                  value={sex}
                  onChange={handleSelectSex}
                  fullWidth
                  label="Sex"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
              {sexError && (
                <p className="text-danger">This field is required</p>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address"
                label="Address line 1"
                placeholder="Enter address"
                variant="outlined"
                helperText={addressError && 'Address is required'}
                onChange={(e) => setAddress(e.target.value)}
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
                helperText={countryError && 'Country is required'}
                variant="outlined"
                onChange={(e) => setCountryRegion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="city"
                label="City"
                placeholder="Enter city"
                variant="outlined"
                onChange={(e) => setCity(e.target.value)}
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
              onChange={(e) => setMobilePhone(e.target.value)}
            />

            <p
              className="text-right underline cursor-pointer text-sm"
              onClick={() => setSeeMoreFormFields(!seeMoreFormFields)}
            >
              Add more details.
            </p>
          </Grid>
          {seeMoreFormFields && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="ministry-label">Ministry</InputLabel>
                  <Select
                    labelId="ministry-label"
                    label="Ministry"
                    id="ministry"
                    name="ministry"
                    value={ministry}
                    onChange={(e) => setMinistry(e.target.value)}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="home_phone"
                  label="home phone"
                  placeholder=""
                  variant="outlined"
                  onChange={(e) => setHomePhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="ministry-label">State</InputLabel>

                  <Select
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    fullWidth
                    label="state/province"
                  >
                    <MenuItem value="NY">New York</MenuItem>
                    <MenuItem value="Fl">Florida</MenuItem>
                    <MenuItem value="CA">California</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="zip"
                  label="Zip/Postal Code"
                  placeholder="Enter 5 digit Zip"
                  variant="outlined"
                  onChange={(e) => setZipPostalCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="notes"
                  label="Notes"
                  placeholder="Enter any notes related to this person"
                  variant="outlined"
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="physician_name"
                  label="Physician's Name"
                  placeholder="Enter Physician's Name"
                  variant="outlined"
                  onChange={(e) => setPhysicianName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="physician_phone"
                  label="Physician's Phone"
                  placeholder="Enter Physician's Phone"
                  variant="outlined"
                  onChange={(e) => setPhysicianPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="allergies"
                  label="Allergies"
                  placeholder="Enter any allergies..."
                  variant="outlined"
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="medications"
                  label="Medications"
                  placeholder="list them seperated by a comma"
                  variant="outlined"
                  onChange={(e) => setMedications(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insurance carrier"
                  label="Insurance Carrier"
                  placeholder="Enter carrier's name"
                  variant="outlined"
                  onChange={(e) => setInsuranceCarrier(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="insurance_number"
                  label="Insurance Number"
                  placeholder="Enter number"
                  variant="outlined"
                  onChange={(e) => setInsuranceCarrier(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  placeholder="Enter city"
                  variant="outlined"
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{ backgroundColor: '#2F2F2F' }}
          onClick={() => handleAddMember()}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}
