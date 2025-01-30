import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Dashboard, TableChart, AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ 로그인 상태 확인 (JWT 토큰 존재 여부)
  const isLoggedIn = !!localStorage.getItem('token');

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    handleAccountMenuClose();
    navigate('/login'); // 로그인 페이지로 이동
  };

  const drawer = (
    <div>
      {/* 상단 로고 */}
      <Toolbar>
        <Typography variant="h6" noWrap>
          community
        </Typography>
      </Toolbar>
      <Divider />
      {/* 네비게이션 항목 */}
      <List>
        {[{ text: '게시판', icon: <Dashboard /> }].map((item) => (
          <Link to="/feed" key={item.text} sx={{ color: "#000", textDecoration: "none" }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      {/* 사용자 계정 메뉴 */}
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountMenuOpen}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="계정 설정" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  // ✅ 로그인 여부에 따른 계정 메뉴 설정
  const accountMenu = (
  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleAccountMenuClose}>
    {isLoggedIn
      ? [
          <MenuItem key="profile-edit" onClick={() => navigate('/profile-edit')}>
            프로필 수정
          </MenuItem>,
          <MenuItem key="logout" onClick={handleLogout}>로그아웃</MenuItem>,
        ]
      : [
          <MenuItem key="login" onClick={() => navigate('/login')}>로그인</MenuItem>,
        ]}
  </Menu>
);

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* 모바일 Drawer */}
        <Drawer
          container={container}
          variant="temporary"
          open={false}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* 데스크톱 Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* 계정 메뉴 */}
      {accountMenu}
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
