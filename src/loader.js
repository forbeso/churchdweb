import React from 'react';

import ClipLoader
from 'react-spinners/ClipLoader';

function Loader() {
  return (
    <ClipLoader
      color='#36d7b7'
      loading
      size={40}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default Loader;
