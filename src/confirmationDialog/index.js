import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export default function ConfirmDialog({
  selectedMember,
  showDialog,
  handleCloseInfoDialog,
  handleConfirm,
}) {
  const [close, setClose] = useState(false);

  const handleClose = () => {
    setClose(!showDialog);
  };

  const FormFieldTypography = ({ label, value }) => (
    <Typography variant="body2">
      {label}: {value}
    </Typography>
  );

  const FormFieldDisplay = ({ selectedMember }) => {
    const formFields = [
      { label: 'First Name', value: selectedMember.first_name },
      { label: 'Last Name', value: selectedMember.last_name },
      { label: 'Sex', value: selectedMember.sex },
      { label: 'Email', value: selectedMember.email },
      { label: 'DOB', value: selectedMember.dob },
      { label: 'Type', value: selectedMember.type },
      { label: 'Status', value: selectedMember.status },
      { label: 'Address', value: selectedMember.address },
      { label: 'Country/Region', value: selectedMember.country_region },
      { label: 'Ministry', value: selectedMember.ministry },
      { label: 'City', value: selectedMember.city },
      { label: 'Zip/Postal Code', value: selectedMember.zip_postal_code },
      { label: 'Mobile Phone', value: selectedMember.mobile_phone },
      { label: 'Notes', value: selectedMember.notes },
      { label: "Physician's Name", value: selectedMember.physician_name },
      { label: "Physician's Phone", value: selectedMember.physician_phone },
      { label: 'Allergies', value: selectedMember.allergies },
      { label: 'Medications', value: selectedMember.medications },
      { label: 'Insurance Carrier', value: selectedMember.insurance_carrier },
      { label: 'Insurance Number', value: selectedMember.insurance_number },
      // Add more fields as needed
    ];

    return (
      <div>
        {formFields.map((field, index) => (
          <FormFieldTypography
            key={index}
            label={field.label}
            value={field.value}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={showDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Your Details</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          You entered the following information:
        </Typography>
        <div className="mt-2 rounded-md bg-gray-200 p-4 text-sm text-muted-foreground">
          <FormFieldDisplay selectedMember={selectedMember}></FormFieldDisplay>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseInfoDialog}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
