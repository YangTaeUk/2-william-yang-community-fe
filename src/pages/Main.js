import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';

import NavBar from '../components/NavBar';
import Feed from '../components/Feed';
import Board from '../components/Board';
import Profile from '../components/Profile';

function Main() {
  return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* 좌측 네비게이션 */}
        <NavBar />
        <Box sx={{ width :'100%' }}>
          <Grid container sx={{ width :'100%', marginTop: '20px' }}>
            <Grid size={1} sx={{ height: '100vh' }}>
            </Grid>
            <Grid size={10} sx={{ height: '100vh' }}>
              <Routes>
                <Route path="/" element={<Feed />} />
              </Routes>
            </Grid>
            <Grid size={1} sx={{ height: '100vh' }}>
            </Grid>
          </Grid>
        </Box>
      </Box>
  );
}

export default Main;
