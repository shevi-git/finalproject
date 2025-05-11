import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        דף הבית
      </Typography>
      <Typography variant="body1">
        ברוכים הבאים למערכת הניהול של הבניין
      </Typography>
    </Box>
  );
}

export default Home;
