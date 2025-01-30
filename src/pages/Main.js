import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NavBar from '../components/NavBar';

function Main() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* 좌측 네비게이션 */}
      <NavBar />

      {/* 메인 콘텐츠 영역 */}
      <Box sx={{ width: '100%' }}>
        <Grid container sx={{ width: '100%', marginTop: '20px' }}>
          <Grid size={1} sx={{ height: '100vh' }}></Grid>
          <Grid size={10} sx={{ height: '100vh' }}>
            {/* Outlet을 사용하여 자식 라우트 (Feed, CreateFeed) 렌더링 */}
            <Outlet />
          </Grid>
          <Grid size={1} sx={{ height: '100vh' }}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Main;
