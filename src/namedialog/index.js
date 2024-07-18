import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Component() {
  return (
    <Dialog open={true}>
      <DialogTitle className="text-2xl font-bold text-[#334155]">
        Add Your Name
      </DialogTitle>
      <DialogContent className="max-w-[400px] rounded-2xl bg-[#f1f5f9] p-6 shadow-lg">
        <DialogContentText className="mt-2 text-[#475569]">
          Enter the name you'd like to use for your profile.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          placeholder="Enter your name"
          className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-[#334155] focus:border-[#a5b4fc] focus:outline-none focus:ring-2 focus:ring-[#a5b4fc]"
        />
      </DialogContent>
      <DialogActions className="mt-4 space-y-4">
        <Button
          variant="contained"
          onClick={() => {}}
          className="w-full rounded-lg bg-[#4f46e5] py-2 text-white hover:bg-[#4338ca]"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
