import React, { useEffect, useState, useContext } from 'react';

import supabase from '../supabase';

import { SupabaseContext } from '../SupabaseContext';
import './style.scss';

function Sermon() {
  const [uploadedText, setUploadedText] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      setUploadedText(contents);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.txt,.ppt,.pptx"
      />
      <button type="button" onClick={() => console.log(uploadedText)}>
        Upload
      </button>
      <p>{uploadedText}</p>
    </div>
  );
}

export default Sermon;
