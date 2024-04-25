// Create a new component for the full-screen loading indicator
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const FullScreenLoading = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999, // Ensure it's above other elements
      }}
    >
      <CircularProgress color="secondary" />
    </Box>
  );
};

export default FullScreenLoading;
